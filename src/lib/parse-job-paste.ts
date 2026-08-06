/**
 * Extrae metadatos de una oferta pegada (LinkedIn u otras fuentes).
 * Funciona offline con heurísticas; no scrapea ni llama a IA.
 */

export type OpportunityType = "fijo-remoto" | "consultoria" | "freelance";

export type ParsedJobPaste = {
  company: string | null;
  role: string | null;
  /** Empleador real si difiere del nombre del anuncio (agencia / marca). */
  employer: string | null;
  location: string | null;
  remote: boolean | null;
  workTime: "completa" | "parcial" | null;
  type: OpportunityType | null;
  salaryRange: string | null;
  postedAgo: string | null;
  applicants: string | null;
  /** Descripción limpia (sin chrome de LinkedIn) para scoring/guardar. */
  cleanDescription: string;
};

const UI_NOISE =
  /^(solicitar|guardar|mostrar m[aá]s|ver m[aá]s|mostrar menos|cerrar|aplicar|apply|save|follow|seguir|probar premium.*|probar Premium.*|accede a informaci[oó]n.*|mira una comparaci[oó]n.*|respuestas gestionadas.*|promocionado( por .*)?|equal employment opportunity employer|sounds good\? apply now!.*)$/i;

const SECTION_HEAD =
  /^(acerca del empleo|about the job|about the role|descripci[oó]n del empleo|job description|requirements?|requisitos|nice to have|benefits?|beneficios|location|ubicaci[oó]n|lo que esperamos de ti|proceso de aplicaci[oó]n|condiciones de la colaboraci[oó]n|\¿?qu[eé] har[aá]s.*)$/i;

const ROLE_HINT =
  /\b(developer|desarrollador|engineer|ingenier[oa]|architect|arquitect[oa]|fullstack|full[\s-]?stack|frontend|front[\s-]?end|backend|back[\s-]?end|devops|sre|data scientist|machine learning|ml engineer|product manager|tech lead|staff|principal|software|programador|consultant|consultor|analyst|analista)\b/i;

const META_LINE =
  /^(.+?)\s*·\s*(hace\s+.+|posted\s+.+|\d+\s*personas?|m[aá]s de\s+\d+|over\s+\d+|.*han hecho clic|.*clicked)/i;

const LOGO_FOR = /logotipo de empresa para\s+(.+)/i;

const SALARY_RE =
  /(?:salario|salary|retribuci[oó]n|compensaci[oó]n|remuneraci[oó]n)[:\s]+([^\n.]{4,80})|(?:€|\$|USD|EUR|COP)\s*[\d.,]+\s*[-–—a/]+\s*(?:€|\$|USD|EUR|COP)?\s*[\d.,]+(?:\s*(?:\/|por)\s*(?:a[nñ]o|year|mes|month|hora|hour))?/i;

function cleanLine(line: string): string {
  return line.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function isNoise(line: string): boolean {
  if (!line) return true;
  if (line.length > 220) return false;
  if (UI_NOISE.test(line)) return true;
  if (/^logotipo de empresa/i.test(line)) return true;
  if (/premium por 0/i.test(line)) return true;
  if (/^the personal data you provide/i.test(line)) return true;
  return false;
}

function looksLikeCompany(line: string): boolean {
  if (!line || line.length < 2 || line.length > 80) return false;
  if (ROLE_HINT.test(line)) return false;
  if (META_LINE.test(line)) return false;
  if (SECTION_HEAD.test(line)) return false;
  if (/^[¿?]/.test(line)) return false;
  if (/\b(remoto|remote|jornada|freelance|vacante|modalidad)\b/i.test(line)) {
    return false;
  }
  // Evitar frases largas: empresa suele ser 1–5 palabras.
  const words = line.split(/\s+/).length;
  return words <= 6;
}

function looksLikeRole(line: string): boolean {
  if (!line || line.length < 4 || line.length > 120) return false;
  if (META_LINE.test(line)) return false;
  if (SECTION_HEAD.test(line)) return false;
  if (/^(en remoto|remote|jornada|solicitar|guardar)\b/i.test(line)) return false;
  if (ROLE_HINT.test(line)) return true;
  // Título tipo "AI Full Stack Developer" sin keyword raro.
  if (/^[A-ZÁÉÍÓÚÑ0-9][\wÁÉÍÓÚÑáéíóúñ+.#/() &\-]{3,100}$/.test(line)) {
    const words = line.split(/\s+/).length;
    return words >= 2 && words <= 12;
  }
  return false;
}

function extractEmployerFromBody(text: string, topCompany: string | null): string | null {
  const patterns = [
    /\bAt\s+([A-Z][\w.&'\- ]{1,60}?),\s+we\b/i,
    /\bEn\s+([A-ZÁÉÍÓÚÑ][\w.&'\- ]{1,60}?),\s+(prioriz|valor|buscamos|ofrec)/i,
    /\b([A-Z][\w.&'\-]{1,40})\s+is an Equal Employment Opportunity/i,
    /\b([A-ZÁÉÍÓÚÑ][\w.&'\-]{1,40})\s+es un empleador/i,
    /Join us[\s\S]{0,80}?\bat\s+([A-Z][\w.&'\- ]{1,40})\b/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    const name = m?.[1]?.trim().replace(/[.,;:]+$/, "");
    if (!name || name.length < 2 || name.length > 60) continue;
    if (topCompany && name.toLowerCase() === topCompany.toLowerCase()) continue;
    if (/^(the|our|this|we|you|el|la|los|las)$/i.test(name)) continue;
    return name;
  }
  return null;
}

function detectType(text: string): OpportunityType | null {
  if (
    /\bfree\s?lance\b|\bcollaboraci[oó]n:\s*freelance\b|tipo de colaboraci[oó]n:\s*freelance|\bcontractor\b|\baut[oó]nom[oa]\b/i.test(
      text,
    )
  ) {
    return "freelance";
  }
  if (/\bconsultor[ií]a\b|\bconsultant\b|\bcontrato mercantil\b/i.test(text)) {
    return "consultoria";
  }
  if (
    /\bjornada completa\b|\bfull[\s-]?time\b|\bpermanent contract\b|\bcontrato indefinido\b|\bfijo\b/i.test(
      text,
    )
  ) {
    return "fijo-remoto";
  }
  return null;
}

function detectRemote(text: string): boolean | null {
  if (
    /100%\s*remoto|full\s*remote|totalmente remoto|en remoto|\bteletrabajo\b|work fully remote|fully remote|modalidad:\s*100%\s*remoto/i.test(
      text,
    )
  ) {
    return true;
  }
  if (
    /\bpresencial\b|\bon[\s-]?site\b|\bin[\s-]?office\b|(modelo|trabajo|jornada|formato|modalidad)\s+h[íi]brid/i.test(
      text,
    )
  ) {
    return false;
  }
  if (/\bremoto\b|\bremote\b/i.test(text)) return true;
  return null;
}

function detectWorkTime(text: string): "completa" | "parcial" | null {
  if (/\bjornada parcial\b|\bpart[\s-]?time\b/i.test(text)) return "parcial";
  if (/\bjornada completa\b|\bfull[\s-]?time\b/i.test(text)) return "completa";
  return null;
}

function detectSalary(text: string): string | null {
  const m = text.match(SALARY_RE);
  if (!m) return null;
  const raw = (m[1] || m[0] || "").trim();
  return raw.slice(0, 120) || null;
}

function detectPostedAndApplicants(metaRest: string): {
  postedAgo: string | null;
  applicants: string | null;
} {
  const posted =
    metaRest.match(/hace\s+[^·]+/i)?.[0]?.trim() ||
    metaRest.match(/posted\s+[^·]+/i)?.[0]?.trim() ||
    null;
  const applicants =
    metaRest.match(
      /(?:m[aá]s de\s+)?\d[\d.,]*\s*personas?(?:\s+han hecho clic[^·]*)?/i,
    )?.[0]?.trim() ||
    metaRest.match(/over\s+\d[\d.,]*\s*(?:people|applicants)[^·]*/i)?.[0]?.trim() ||
    null;
  return {
    postedAgo: posted?.slice(0, 80) || null,
    applicants: applicants?.slice(0, 120) || null,
  };
}

function pickHeaderFields(lines: string[]): {
  company: string | null;
  role: string | null;
  location: string | null;
  postedAgo: string | null;
  applicants: string | null;
} {
  let company: string | null = null;
  let role: string | null = null;
  let location: string | null = null;
  let postedAgo: string | null = null;
  let applicants: string | null = null;

  for (const line of lines.slice(0, 25)) {
    const logo = line.match(LOGO_FOR);
    if (logo?.[1]) {
      company = logo[1].trim();
      break;
    }
  }

  // Buscar línea meta "España · hace 1 semana · …"
  let metaIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 40); i++) {
    const m = lines[i].match(META_LINE);
    if (!m) continue;
    metaIdx = i;
    location = cleanLine(m[1]).slice(0, 160) || null;
    const rest = lines[i].slice(m[1].length);
    const pa = detectPostedAndApplicants(rest);
    postedAgo = pa.postedAgo;
    applicants = pa.applicants;
    break;
  }

  // Rol: línea justo antes de la meta, o "Vacante: …"
  for (const line of lines) {
    const vac = line.match(/^(?:vacante|puesto|rol|cargo|title)\s*[:\-–—]\s*(.+)$/i);
    if (vac?.[1] && looksLikeRole(vac[1])) {
      role = vac[1].trim();
      break;
    }
  }

  if (metaIdx > 0) {
    const before = lines.slice(0, metaIdx).filter((l) => !isNoise(l));
    // Últimas líneas antes de meta: … company, role
    for (let i = before.length - 1; i >= 0; i--) {
      const line = before[i];
      if (!role && looksLikeRole(line)) {
        role = line;
        continue;
      }
      if (role && !company && looksLikeCompany(line)) {
        company = line;
        break;
      }
      if (!role && looksLikeCompany(line) && !company) {
        // Puede ser empresa si aún no hay rol; seguir buscando rol debajo.
        company = line;
      }
    }
    // Si company quedó después del rol en el orden, reordenar por posición.
    if (company && role) {
      const ci = before.findIndex((l) => l === company);
      const ri = before.findIndex((l) => l === role);
      if (ci > ri && ci !== -1 && ri !== -1) {
        // Rol apareció antes que empresa: intercambiar solo si company parece rol.
        if (looksLikeRole(company) && looksLikeCompany(role)) {
          const tmp = company;
          company = role;
          role = tmp;
        }
      }
    }
  }

  // Fallback: primeras líneas útiles
  if (!company || !role) {
    const head = lines.filter((l) => !isNoise(l) && !SECTION_HEAD.test(l)).slice(0, 8);
    for (const line of head) {
      if (!company && looksLikeCompany(line)) {
        company = line;
        continue;
      }
      if (company && !role && looksLikeRole(line)) {
        role = line;
        break;
      }
      if (!role && looksLikeRole(line)) {
        role = line;
      }
    }
  }

  return { company, role, location, postedAgo, applicants };
}

function buildCleanDescription(raw: string, lines: string[]): string {
  const startIdx = lines.findIndex((l) => SECTION_HEAD.test(l));
  const bodyLines =
    startIdx >= 0
      ? lines.slice(startIdx + (/^acerca del empleo|about the job/i.test(lines[startIdx]) ? 1 : 0))
      : lines;

  const cleaned = bodyLines
    .filter((l) => !isNoise(l))
    .filter((l) => !META_LINE.test(l))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Si el limpio quedó demasiado corto, devolver el original sin chrome obvio.
  if (cleaned.length < 80) {
    return raw
      .split(/\r?\n/)
      .map(cleanLine)
      .filter((l) => !isNoise(l))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 20000);
  }
  return cleaned.slice(0, 20000);
}

/**
 * Parsea texto pegado de una oferta (típicamente LinkedIn copiado).
 */
export function parseJobPaste(raw: string): ParsedJobPaste {
  const text = raw.replace(/\r\n/g, "\n").trim();
  const allLines = text.split("\n").map(cleanLine);
  const lines = allLines.filter(Boolean);

  const header = pickHeaderFields(lines);
  const blob = text.slice(0, 20000);
  const employer = extractEmployerFromBody(blob, header.company);
  const remote = detectRemote(blob);
  const workTime = detectWorkTime(blob);
  let type = detectType(blob);
  if (!type && remote === true && workTime === "completa") type = "fijo-remoto";
  if (!type && workTime === "parcial" && /freelance|colaboraci[oó]n/i.test(blob)) {
    type = "freelance";
  }

  // Ubicación más específica en sección Location / oficina.
  let location = header.location;
  const cityMatch = blob.match(
    /\b(?:office|oficina)\s+(?:is\s+)?in\s+([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ\- ]{2,40})/i,
  );
  const barcelona = /\bBarcelona\b/i.test(blob) ? "Barcelona" : null;
  if (barcelona && location && /espa[nñ]a|spain/i.test(location)) {
    location = `${barcelona}, ${location}`;
  } else if (!location && (cityMatch?.[1] || barcelona)) {
    location = (cityMatch?.[1] || barcelona)!.trim().slice(0, 160);
  }

  // Nombre del anuncio (top-card LinkedIn). El empleador real va en `employer`.
  const company = header.company;

  const salaryRange = detectSalary(blob);
  const cleanDescription = buildCleanDescription(text, lines);

  return {
    company: company?.slice(0, 200) || null,
    role: header.role?.slice(0, 200) || null,
    employer: employer?.slice(0, 200) || null,
    location: location?.slice(0, 160) || null,
    remote,
    workTime,
    type,
    salaryRange,
    postedAgo: header.postedAgo,
    applicants: header.applicants,
    cleanDescription: cleanDescription || text.slice(0, 20000),
  };
}

/** Rellena huecos: usa parsed solo donde el valor actual esté vacío. */
export function mergeParsedJob(
  current: {
    company?: string;
    role?: string;
    location?: string | null;
    salaryRange?: string | null;
    type?: string;
    jobDescription?: string;
  },
  parsed: ParsedJobPaste,
  opts: { preferCleanDescription?: boolean } = {},
) {
  const listing = parsed.company;
  const employer = parsed.employer;
  let company = current.company?.trim() || "";
  if (!company) {
    if (employer && listing && employer.toLowerCase() !== listing.toLowerCase()) {
      company = `${employer} (${listing})`;
    } else {
      company = listing || employer || "";
    }
  }
  const role = current.role?.trim() || parsed.role || "";
  const location = current.location?.trim() || parsed.location || null;
  const salaryRange = current.salaryRange?.trim() || parsed.salaryRange || null;
  const type =
    current.type && ["fijo-remoto", "consultoria", "freelance"].includes(current.type)
      ? current.type
      : parsed.type || "fijo-remoto";
  const jobDescription =
    opts.preferCleanDescription && parsed.cleanDescription.length >= 40
      ? parsed.cleanDescription
      : current.jobDescription?.trim() || parsed.cleanDescription;

  return { company, role, location, salaryRange, type, jobDescription, parsed };
}

/** Resumen corto para mostrar bajo el textarea tras pegar. */
export function formatParsedSummary(p: ParsedJobPaste): string {
  const bits: string[] = [];
  if (p.company) bits.push(p.company);
  if (p.employer && p.employer.toLowerCase() !== p.company?.toLowerCase()) {
    bits.push(`empleador: ${p.employer}`);
  }
  if (p.role) bits.push(p.role);
  if (p.location) bits.push(p.location);
  if (p.remote === true) bits.push("remoto");
  if (p.remote === false) bits.push("no remoto");
  if (p.workTime) bits.push(`jornada ${p.workTime}`);
  if (p.type) bits.push(p.type);
  if (p.salaryRange) bits.push(p.salaryRange);
  if (p.postedAgo) bits.push(p.postedAgo);
  if (p.applicants) bits.push(p.applicants);
  return bits.join(" · ");
}
