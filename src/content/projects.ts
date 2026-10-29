import type { Project } from './types';

import ordivoxLogo from '../assets/projects/ordivox/ordivox-logo-reference.jpg';
import ordivoxSummary from '../assets/projects/ordivox/dashboard-resumo.png';
import ordivoxPrices from '../assets/projects/ordivox/dashboard-precos.png';
import ordivoxAgent from '../assets/projects/ordivox/dashboard-agente.png';
import ordivoxTrends from '../assets/projects/ordivox/dashboard-tendencias.png';

const ORDIVOX_REPO = 'https://github.com/agentealfredoclaw/ORDIVOX';

/**
 * Every project in the portfolio. Order here is the display order inside each
 * category. See README → "Adding a project" for the fields and status rules.
 */
export const projects: Project[] = [
  /* ── Automation & AI ─────────────────────────────────────────────── */
  {
    slug: 'ordivox',
    category: 'automation',
    title: 'ORDIVOX',
    origin: 'product',
    status: 'published',
    stage: 'Running in private use · Proprietary',
    year: '2026',
    summary:
      'A WhatsApp assistant that turns receipt photos, PDF invoices, voice notes and short texts into validated expense records in PostgreSQL. The model extracts, Python validates, and people confirm documents before anything is saved.',
    tags: ['Python', 'FastAPI', 'WhatsApp Cloud API', 'OpenAI Responses API', 'PostgreSQL', 'JSON Schema'],
    cover: { image: ordivoxSummary, alt: 'ORDIVOX dashboard in demo mode: monthly settlement, spending by category and the list of expenses.' },
    brand: {
      logo: ordivoxLogo,
      logoAlt: 'ORDIVOX — Intelligent Financial Automation — A product by DVO Dynamics',
      kicker: 'Intelligent financial automation',
      credit: 'A product by DVO Dynamics',
    },
    links: [
      { label: 'GitHub repository', href: ORDIVOX_REPO, external: true },
      { label: 'JSON contract (PT)', href: `${ORDIVOX_REPO}/blob/main/docs/contrato_json.md`, external: true },
      { label: 'Security policy (PT)', href: `${ORDIVOX_REPO}/blob/main/docs/seguranca.md`, external: true },
    ],
    sections: {
      problem: [
        {
          type: 'p',
          text: 'A home shared by two people produces a steady stream of expenses — supermarket receipts, utility invoices, small payments — arriving as photos, PDFs, voice notes or a quick message. Each one has to be recorded, split fairly and settled at the end of the month.',
        },
        {
          type: 'p',
          text: 'ORDIVOX takes the bookkeeping out of that routine. The two people send the document through a channel they already use, WhatsApp, and get back a structured record they can verify, plus a dashboard that shows who owes whom, where the money goes and how prices change from shop to shop.',
        },
        {
          type: 'facts',
          items: [
            { label: 'Users', value: 'The two people sharing the household' },
            { label: 'Inputs', value: 'Photos (JPG, PNG, WebP), PDFs, voice notes (OGG, MP3, M4A, WAV, WebM) and plain text' },
            { label: 'Output', value: 'Validated expense records in PostgreSQL, split 50/50' },
          ],
        },
      ],
      objectives: [
        {
          type: 'list',
          items: [
            'Accept any kind of receipt through a conversational channel, and always reply in writing.',
            'Let the model read and extract — but never let it write to the database.',
            'Keep people in control: nothing from a photo or PDF is saved before it is confirmed.',
            'Split every expense to the cent and net everything out in a monthly settlement.',
            'Make AI and messaging costs visible per message, per day and per month.',
          ],
        },
      ],
      architecture: [
        {
          type: 'p',
          text: 'One Python application with two faces: a webhook that serves the WhatsApp conversation and a private dashboard on the local network.',
        },
        {
          type: 'steps',
          items: [
            { title: 'WhatsApp → Meta Cloud API → webhook', text: 'Messages reach a FastAPI webhook. The signature is checked, only the registered numbers are served, each person has a message limit and every message is processed once.' },
            { title: 'Agent — OpenAI Responses API', text: 'Text, photos and PDFs go to the model; voice notes are transcribed first. The model answers by calling one of two tools with a JSON payload.' },
            { title: 'Python validation', text: 'The payload is checked against a strict, versioned JSON contract and the business rules. Python computes the 50/50 split and is the only component that saves.' },
            { title: 'PostgreSQL', text: 'The application’s database user can only SELECT and INSERT: nothing is overwritten or deleted, and every change is a new row.' },
            { title: 'Dashboard', text: 'FastAPI with plain JavaScript and hand-written SVG charts: monthly settlement, spending by category, price history and the agent’s activity and costs.' },
          ],
        },
        {
          type: 'facts',
          items: [
            { label: 'Language', value: 'Python 3.14' },
            { label: 'Web', value: 'FastAPI' },
            { label: 'Database', value: 'PostgreSQL 18 (psycopg 3)' },
            { label: 'AI', value: 'OpenAI Responses API; a speech-to-text model for voice notes' },
            { label: 'Messaging', value: 'WhatsApp Cloud API (Meta)' },
            { label: 'Front end', value: 'Plain JavaScript, hand-written SVG charts' },
            { label: 'Operations', value: 'Windows Task Scheduler, a watchdog, an ngrok tunnel, daily backups and a restore script' },
          ],
        },
      ],
      methodology: [
        {
          type: 'p',
          text: 'The central design decision is a double check. The model converses, extracts and makes sure no required field is empty; Python validates everything again, computes the split and is the only part that writes. A well-formed JSON payload is not, on its own, an authorised expense.',
        },
        {
          type: 'steps',
          items: [
            { title: 'Text or voice note', text: 'The model extracts the data, asks for anything missing in a single message and calls registrar_despesa. Python validates and saves in one transaction, then confirms with the data it stored.' },
            { title: 'Photo or PDF', text: 'The model calls validar_despesa. Python validates without saving and sends a summary with Confirm and Correct buttons. On Confirm, Python re-validates the approved payload and saves exactly what was confirmed — the model plays no part in that step.' },
          ],
        },
        {
          type: 'facts',
          items: [
            { label: 'categoria', value: 'From the list allowed for the input type' },
            { label: 'estabelecimento', value: 'From an allowed list, or free text under “Outro”' },
            { label: 'data_documento', value: 'YYYY-MM-DD, a valid calendar date' },
            { label: 'valor_total', value: 'Decimal string with exactly two places, greater than zero' },
            { label: 'pago_por', value: 'One of the two registered people' },
            { label: 'itens', value: 'Always present; empty for text messages; at most 300 items' },
            { label: 'desconto_global', value: 'Optional, photos and PDFs only: a discount on the total' },
          ],
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Excerpt from ordivox/contrato.py: the shape of the payload is checked first, then the rules for each input type. Identifiers are in Portuguese.',
          code: `PADRAO_DATA = r"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
PADRAO_MONETARIO = r"^[0-9]{1,10}\\.[0-9]{2}$"


def validar_regras(despesa: PayloadDespesa, contexto: ContextoMensagem) -> None:
    \"\"\"Aplica as regras de cada tipo de entrada (contrato, seccoes 3 a 5).\"\"\"
    erros: list[ErroCampo] = []

    if contexto.tipo_entrada == "texto":
        _validar_texto(despesa, contexto, erros)
    else:
        _validar_documento(despesa, contexto, erros)

    if erros:
        raise ErroContrato(erros)


def validar_payload(
    payload: object,
    contexto: ContextoMensagem,
) -> PayloadDespesa:
    \"\"\"Valida o formato e depois as regras do tipo de entrada.\"\"\"
    despesa = validar_formato(payload)
    validar_regras(despesa, contexto)

    return despesa`,
        },
        {
          type: 'p',
          text: 'Rejections are typed, so the agent knows what to do next: format errors are corrected and resent automatically (at most twice), reading errors trigger one re-read of the document, content errors are explained to the person, and technical failures save nothing. Each expense gets at most three correction rounds, and a pending confirmation expires after 24 hours.',
        },
        {
          type: 'p',
          text: 'The sender, input type, timestamp (Europe/Lisbon) and message id come from the WhatsApp integration — never from the model.',
        },
        {
          type: 'note',
          tone: 'info',
          text: 'Field names are in European Portuguese, as in the product. Summarised from the project’s JSON contract, version 1.4.',
        },
      ],
      security: [
        {
          type: 'steps',
          items: [
            { title: 'Webhook', text: 'Meta’s X-Hub-Signature-256 is verified in constant time; only the two registered numbers are served; each person has a message limit; each message is processed once.' },
            { title: 'AI', text: 'Two tools and no database access. The authenticated context travels in a developer message, apart from user content, and text inside receipts and voice notes is treated as data, never as instructions. Requests use store=False.' },
            { title: 'Database', text: 'The application user can only SELECT and INSERT, so nothing is overwritten or deleted.' },
            { title: 'Dashboard', text: 'Local network only. Sign-in with a phone number and a scrypt-hashed password, a signed HttpOnly, SameSite=Strict session cookie, CSRF protection, a Content Security Policy and login rate limits.' },
            { title: 'Secrets', text: 'Kept only in the environment file; logs mask phone numbers and keys.' },
          ],
        },
        {
          type: 'note',
          tone: 'info',
          text: 'These are the controls implemented in the code, as documented in the repository. No certification or regulatory compliance is claimed.',
        },
      ],
      results: [
        {
          type: 'findings',
          items: [
            { kind: 'observed', text: 'Runs 24/7 on a home Windows PC with scheduled tasks, a watchdog, an ngrok tunnel for the webhook and daily backups with a restore script.' },
            { kind: 'observed', text: 'Four input types — photo, PDF, voice note and text — are handled in one WhatsApp conversation; documents are saved only after Confirm.' },
            { kind: 'observed', text: 'A 50/50 split to the cent, with the odd cent alternating between the two people, feeds a monthly settlement. A personal item on a shared receipt can be taken out of the split and put back without deleting anything.' },
            { kind: 'observed', text: 'The Agent tab shows what happened with each message, OpenAI cost and tokens (today, this month, all time) and WhatsApp costs read from Meta’s billing API.' },
            { kind: 'observed', text: 'The validation rules and flows are covered by automated tests (unittest).' },
            { kind: 'open-question', text: 'Usage volume, extraction accuracy and time saved have not been measured or published yet. They will be added here once they are.' },
          ],
        },
        {
          type: 'gallery',
          items: [
            { image: ordivoxSummary, alt: 'Monthly summary: settlement between the two people, spending by category and the list of expenses.', caption: 'Monthly summary and settlement' },
            { image: ordivoxPrices, alt: 'Price history of one product across different shops.', caption: 'Price history across shops' },
            { image: ordivoxAgent, alt: 'Agent tab with API costs and the steps taken for each message.', caption: 'Agent activity and API costs' },
            { image: ordivoxTrends, alt: 'Spending trends by category over several months.', caption: 'Spending trends by category' },
          ],
        },
        {
          type: 'note',
          tone: 'info',
          text: 'Screenshots come from the built-in demo mode, with fictitious data.',
        },
      ],
      limitations: [
        {
          type: 'list',
          items: [
            'Built for one household of two people: the 50/50 rule and the list of payers are fixed by design.',
            'Runs on a single home PC behind an ngrok tunnel, so availability depends on that machine and its connection.',
            'The dashboard is reachable only from the local network.',
            'Interface and documentation are in European Portuguese.',
            'Proprietary software: the repository is public as a portfolio piece only.',
          ],
        },
      ],
    },
  },

  /* ── Data Engineering & Analytics ────────────────────────────────── */
  {
    slug: 'starbucks-business-recovery',
    category: 'data-engineering-analytics',
    title: 'Starbucks — Business Recovery Analytics',
    origin: 'personal',
    status: 'in-development',
    summary:
      'A case study examining comparable sales, transactions, average ticket and the relationship between price and purchasing volume.',
    tags: ['Commercial analytics', 'Comparable sales', 'Price analysis'],
    sections: {
      problem: [
        {
          type: 'p',
          text: 'Comparable sales can change because more customers come in, because each visit is worth more, or both. This case study looks at Starbucks through those drivers — comparable sales, transactions and average ticket — and at how price relates to purchasing volume.',
        },
      ],
      objectives: [
        {
          type: 'list',
          items: [
            'Break comparable sales down into transactions and average ticket.',
            'Examine the relationship between price and purchasing volume.',
            'Document data sources, method and limitations before stating any conclusion.',
          ],
        },
      ],
      results: [
        {
          type: 'note',
          tone: 'pending',
          text: 'No findings are published yet. Results will appear here only after the analysis has been validated.',
        },
      ],
    },
  },
  {
    slug: 'geospatial-ooh-analytics',
    category: 'data-engineering-analytics',
    title: 'Geospatial OOH Analytics',
    origin: 'professional',
    status: 'coming-soon',
    summary:
      'Geospatial workflows for audience targeting, asset mapping and business intelligence in out-of-home advertising. To be published with anonymised or synthetic data.',
    tags: ['GeoPandas', 'SQL', 'BI'],
    related: [{ label: 'Background: MOP', href: '/experience/mop/' }],
  },
  {
    slug: 'etl-business-intelligence',
    category: 'data-engineering-analytics',
    title: 'ETL & Business Intelligence',
    status: 'coming-soon',
    summary: 'An end-to-end project covering data integration, transformation and visualisation.',
    tags: ['ETL', 'Data modelling', 'Dashboards'],
  },

  /* ── Data Science & Machine Learning ─────────────────────────────── */
  {
    slug: 'market-investment-forecasting',
    category: 'data-science',
    title: 'Market Investment Forecasting',
    origin: 'professional',
    status: 'coming-soon',
    summary:
      'Python machine-learning models that forecast advertising investment from historical data, delivered through dashboards. Case study to be written from my work at MOP.',
    tags: ['Python', 'Machine Learning', 'Forecasting'],
    related: [{ label: 'Background: MOP', href: '/experience/mop/' }],
  },
  {
    slug: 'rag-knowledge-retrieval',
    category: 'data-science',
    title: 'RAG Knowledge Retrieval',
    origin: 'professional',
    status: 'coming-soon',
    summary:
      'Document ingestion, embedding generation, vector search and response orchestration for context-aware retrieval. Case study to be written from my work at MOP.',
    tags: ['RAG', 'Embeddings', 'Vector search'],
    related: [{ label: 'Background: MOP', href: '/experience/mop/' }],
  },
  {
    slug: 'predictive-machine-learning',
    category: 'data-science',
    title: 'Predictive Machine Learning',
    status: 'coming-soon',
    summary: 'A space for upcoming predictive models, each documented with its data, evaluation and limitations.',
    tags: ['Machine Learning', 'Model evaluation'],
  },
];
