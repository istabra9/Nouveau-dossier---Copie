import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import * as XLSX from "xlsx";

import { getPlatformDataset } from "@/backend/repositories/platform-repository";
import type {
  EnrollmentRecord,
  ReportType,
  Role,
  Training,
  UserRecord,
} from "@/frontend/types";

type ReportKey = Exclude<ReportType, "all">;
type CellValue = string | number | boolean | null;
type ReportRow = Record<string, CellValue>;

export type ReportFilters = {
  role?: Role;
};

type ColumnDefinition = {
  key: string;
  label: string;
  width: number;
  pdfWidth?: number;
  align?: "left" | "center" | "right";
};

const SHEET_ORDER: ReportKey[] = [
  "users",
  "trainings",
  "enrollments",
  "revenue",
  "durations",
];

const SECTION_TITLES: Record<ReportKey, string> = {
  users: "Users register",
  trainings: "Trainings portfolio",
  enrollments: "Enrollments follow-up",
  revenue: "Payments and revenue",
  durations: "Training durations",
};

const EXCEL_COLUMNS: Record<ReportKey, ColumnDefinition[]> = {
  users: [
    { key: "userId", label: "User ID", width: 14 },
    { key: "recordId", label: "Record ID", width: 28 },
    { key: "fullName", label: "Full name", width: 28 },
    { key: "firstName", label: "First name", width: 16 },
    { key: "lastName", label: "Last name", width: 18 },
    { key: "gender", label: "Gender", width: 14 },
    { key: "age", label: "Age", width: 10 },
    { key: "post", label: "Post / department", width: 24 },
    { key: "role", label: "Role", width: 14 },
    { key: "company", label: "Company", width: 20 },
    { key: "status", label: "Status", width: 14 },
    { key: "active", label: "Active", width: 10 },
    { key: "trainingState", label: "Training state", width: 18 },
    { key: "inTraining", label: "In training", width: 12 },
    { key: "currentTraining", label: "Current training", width: 30 },
    { key: "trainingCode", label: "Training code", width: 16 },
    { key: "trainingCategory", label: "Training category", width: 22 },
    { key: "trainingFormat", label: "Training format", width: 16 },
    { key: "trainerName", label: "Trainer", width: 22 },
    { key: "trainingStartDate", label: "Training start date", width: 18 },
    { key: "trainingEndDate", label: "Training end date", width: 18 },
    { key: "enrollmentStatus", label: "Enrollment status", width: 18 },
    { key: "progressPercent", label: "Progress %", width: 12 },
    { key: "emailAddress", label: "Email address", width: 28 },
    { key: "phoneNumber", label: "Phone number", width: 18 },
    { key: "state", label: "State / address", width: 18 },
    { key: "authProvider", label: "Auth provider", width: 16 },
    { key: "emailVerified", label: "Email verified", width: 14 },
    { key: "onboardingCompleted", label: "Onboarding done", width: 16 },
    { key: "focusTracks", label: "Focus tracks", width: 28 },
    { key: "joinedAt", label: "Joined at", width: 18 },
    { key: "lastLoginAt", label: "Last login", width: 18 },
  ],
  trainings: [
    { key: "trainingId", label: "Training ID", width: 28 },
    { key: "code", label: "Code", width: 12 },
    { key: "title", label: "Title", width: 30 },
    { key: "category", label: "Category", width: 22 },
    { key: "level", label: "Level", width: 16 },
    { key: "format", label: "Format", width: 14 },
    { key: "status", label: "Status", width: 14 },
    { key: "trainerName", label: "Trainer", width: 22 },
    { key: "trainerEmail", label: "Trainer email", width: 28 },
    { key: "startDate", label: "Start date", width: 16 },
    { key: "endDate", label: "End date", width: 16 },
    { key: "durationDays", label: "Duration days", width: 14 },
    { key: "totalHours", label: "Total hours", width: 14 },
    { key: "seats", label: "Seats", width: 10 },
    { key: "enrolledUsers", label: "Enrolled users", width: 14 },
    { key: "completionRate", label: "Completion rate %", width: 18 },
    { key: "price", label: "Price", width: 12 },
    { key: "nextSession", label: "Next session", width: 18 },
  ],
  enrollments: [
    { key: "enrollmentId", label: "Enrollment ID", width: 28 },
    { key: "userId", label: "User ID", width: 14 },
    { key: "fullName", label: "Full name", width: 24 },
    { key: "gender", label: "Gender", width: 12 },
    { key: "age", label: "Age", width: 10 },
    { key: "emailAddress", label: "Email address", width: 28 },
    { key: "phoneNumber", label: "Phone number", width: 18 },
    { key: "trainingCode", label: "Training code", width: 14 },
    { key: "trainingTitle", label: "Training title", width: 30 },
    { key: "trainingFormat", label: "Training format", width: 16 },
    { key: "trainerName", label: "Trainer", width: 20 },
    { key: "trainingStartDate", label: "Training start date", width: 18 },
    { key: "trainingEndDate", label: "Training end date", width: 18 },
    { key: "status", label: "Enrollment status", width: 18 },
    { key: "inTraining", label: "In training", width: 12 },
    { key: "progressPercent", label: "Progress %", width: 12 },
    { key: "amount", label: "Amount", width: 12 },
    { key: "company", label: "Company", width: 18 },
    { key: "department", label: "Department", width: 18 },
    { key: "startedAt", label: "Started at", width: 18 },
    { key: "nextSession", label: "Next session", width: 18 },
    { key: "completedAt", label: "Completed at", width: 18 },
  ],
  revenue: [
    { key: "invoiceNumber", label: "Invoice number", width: 18 },
    { key: "paymentId", label: "Payment ID", width: 28 },
    { key: "userId", label: "User ID", width: 14 },
    { key: "fullName", label: "Full name", width: 24 },
    { key: "emailAddress", label: "Email address", width: 28 },
    { key: "phoneNumber", label: "Phone number", width: 18 },
    { key: "trainingCode", label: "Training code", width: 14 },
    { key: "trainingTitle", label: "Training title", width: 30 },
    { key: "status", label: "Payment status", width: 14 },
    { key: "provider", label: "Provider", width: 18 },
    { key: "method", label: "Method", width: 16 },
    { key: "amount", label: "Amount", width: 12 },
    { key: "currency", label: "Currency", width: 12 },
    { key: "paidAt", label: "Paid at", width: 18 },
  ],
  durations: [
    { key: "trainingCode", label: "Training code", width: 14 },
    { key: "trainingTitle", label: "Training title", width: 30 },
    { key: "category", label: "Category", width: 22 },
    { key: "status", label: "Status", width: 14 },
    { key: "format", label: "Format", width: 14 },
    { key: "startDate", label: "Start date", width: 16 },
    { key: "endDate", label: "End date", width: 16 },
    { key: "durationDays", label: "Duration days", width: 14 },
    { key: "totalHours", label: "Total hours", width: 14 },
    { key: "trainerName", label: "Trainer", width: 22 },
    { key: "enrolledUsers", label: "Enrolled users", width: 14 },
  ],
};

const PDF_COLUMNS: Record<ReportKey, ColumnDefinition[]> = {
  users: [
    { key: "userId", label: "User ID", width: 14, pdfWidth: 62 },
    { key: "fullName", label: "Full name", width: 28, pdfWidth: 118 },
    { key: "gender", label: "Gender", width: 14, pdfWidth: 52 },
    { key: "post", label: "Post", width: 24, pdfWidth: 94 },
    { key: "age", label: "Age", width: 10, pdfWidth: 36, align: "center" },
    { key: "emailAddress", label: "Email", width: 28, pdfWidth: 146 },
    { key: "phoneNumber", label: "Phone", width: 18, pdfWidth: 80 },
    { key: "trainingStartDate", label: "Start", width: 18, pdfWidth: 60 },
    { key: "trainingEndDate", label: "End", width: 18, pdfWidth: 60 },
    { key: "inTraining", label: "In training", width: 12, pdfWidth: 58, align: "center" },
    { key: "active", label: "Active", width: 10, pdfWidth: 48, align: "center" },
  ],
  trainings: [
    { key: "code", label: "Code", width: 12, pdfWidth: 58 },
    { key: "title", label: "Training", width: 30, pdfWidth: 170 },
    { key: "category", label: "Category", width: 22, pdfWidth: 106 },
    { key: "trainerName", label: "Trainer", width: 22, pdfWidth: 116 },
    { key: "status", label: "Status", width: 14, pdfWidth: 64 },
    { key: "startDate", label: "Start", width: 16, pdfWidth: 64 },
    { key: "endDate", label: "End", width: 16, pdfWidth: 64 },
    { key: "totalHours", label: "Hours", width: 14, pdfWidth: 54, align: "right" },
  ],
  enrollments: [
    { key: "userId", label: "User ID", width: 14, pdfWidth: 62 },
    { key: "fullName", label: "Learner", width: 24, pdfWidth: 104 },
    { key: "trainingTitle", label: "Training", width: 30, pdfWidth: 180 },
    { key: "status", label: "Status", width: 18, pdfWidth: 76 },
    { key: "progressPercent", label: "Progress %", width: 12, pdfWidth: 62, align: "right" },
    { key: "trainingStartDate", label: "Start", width: 18, pdfWidth: 62 },
    { key: "trainingEndDate", label: "End", width: 18, pdfWidth: 62 },
    { key: "inTraining", label: "In training", width: 12, pdfWidth: 64, align: "center" },
  ],
  revenue: [
    { key: "invoiceNumber", label: "Invoice", width: 18, pdfWidth: 88 },
    { key: "fullName", label: "Learner", width: 24, pdfWidth: 118 },
    { key: "trainingTitle", label: "Training", width: 30, pdfWidth: 180 },
    { key: "status", label: "Status", width: 14, pdfWidth: 68 },
    { key: "method", label: "Method", width: 16, pdfWidth: 72 },
    { key: "amount", label: "Amount", width: 12, pdfWidth: 64, align: "right" },
    { key: "paidAt", label: "Paid at", width: 18, pdfWidth: 80 },
  ],
  durations: [
    { key: "trainingCode", label: "Code", width: 14, pdfWidth: 62 },
    { key: "trainingTitle", label: "Training", width: 30, pdfWidth: 186 },
    { key: "category", label: "Category", width: 22, pdfWidth: 112 },
    { key: "format", label: "Format", width: 14, pdfWidth: 76 },
    { key: "durationDays", label: "Days", width: 14, pdfWidth: 54, align: "right" },
    { key: "totalHours", label: "Hours", width: 14, pdfWidth: 54, align: "right" },
    { key: "status", label: "Status", width: 14, pdfWidth: 64 },
  ],
};

const PDF_PAGE = {
  width: 1191,
  height: 842,
  marginX: 34,
  top: 44,
  bottom: 34,
};

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

function formatDateTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().replace("T", " ").slice(0, 16);
}

function formatRole(role: Role) {
  if (role === "super_admin") return "Super admin";
  if (role === "admin") return "Admin";
  return "User";
}

function formatSex(value?: UserRecord["sex"]) {
  if (!value) return "";
  if (value === "prefer_not_to_say") return "Prefer not to say";
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatAuthProvider(user: UserRecord) {
  const provider = user.authProvider ?? "local";
  return provider.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatStatus(value?: string | null) {
  if (!value) return "";
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function boolLabel(value: boolean) {
  return value ? "Yes" : "No";
}

function trainingPhase(
  startDate?: string | null,
  endDate?: string | null,
  enrollmentStatus?: EnrollmentRecord["status"],
  hasTraining = false,
) {
  if (!hasTraining && !startDate && !endDate && !enrollmentStatus) {
    return "Not assigned";
  }

  if (enrollmentStatus === "completed") {
    return "Completed";
  }

  const now = Date.now();
  const start = startDate ? new Date(startDate).getTime() : Number.NaN;
  const end = endDate ? new Date(endDate).getTime() : Number.NaN;

  if (Number.isFinite(start) && start > now) {
    return "Scheduled";
  }

  if (Number.isFinite(end) && end < now) {
    return "Completed";
  }

  if (enrollmentStatus === "upcoming" || enrollmentStatus === "confirmed") {
    return Number.isFinite(start) && start > now ? "Scheduled" : "In progress";
  }

  return "In progress";
}

function isInTraining(
  startDate?: string | null,
  endDate?: string | null,
  enrollmentStatus?: EnrollmentRecord["status"],
  hasTraining = false,
) {
  if (!hasTraining && !startDate && !endDate && !enrollmentStatus) {
    return false;
  }

  if (enrollmentStatus === "completed") {
    return false;
  }

  const phase = trainingPhase(startDate, endDate, enrollmentStatus, hasTraining);
  return phase === "In progress";
}

function getRelevantEnrollment(
  enrollments: EnrollmentRecord[],
  trainingsBySlug: Record<string, Training>,
) {
  const priority: Record<EnrollmentRecord["status"], number> = {
    in_progress: 4,
    upcoming: 3,
    confirmed: 2,
    completed: 1,
  };

  return [...enrollments].sort((left, right) => {
    const priorityDiff = priority[right.status] - priority[left.status];
    if (priorityDiff !== 0) return priorityDiff;

    const leftDate = trainingsBySlug[left.trainingSlug]?.startDate ?? left.startedAt;
    const rightDate = trainingsBySlug[right.trainingSlug]?.startDate ?? right.startedAt;
    return rightDate.localeCompare(leftDate);
  })[0];
}

function buildSheet(workbook: XLSX.WorkBook, name: string, columns: ColumnDefinition[], rows: ReportRow[]) {
  const data = [
    columns.map((column) => column.label),
    ...(rows.length > 0
      ? rows.map((row) =>
          columns.map((column) => {
            const value = row[column.key];
            return value === null ? "" : value;
          }),
        )
      : [columns.map((column, index) => (index === 0 ? "No records." : ""))]),
  ];

  const sheet = XLSX.utils.aoa_to_sheet(data);
  sheet["!cols"] = columns.map((column) => ({ wch: column.width }));
  sheet["!autofilter"] = {
    ref: XLSX.utils.encode_range({
      s: { c: 0, r: 0 },
      e: { c: columns.length - 1, r: Math.max(0, data.length - 1) },
    }),
  };

  XLSX.utils.book_append_sheet(workbook, sheet, name);
}

function fitText(text: string, font: PDFFont, size: number, width: number) {
  if (!text) return "";
  if (font.widthOfTextAtSize(text, size) <= width) return text;

  let clipped = text;
  while (clipped.length > 1 && font.widthOfTextAtSize(`${clipped}...`, size) > width) {
    clipped = clipped.slice(0, -1);
  }
  return `${clipped.trimEnd()}...`;
}

function toPdfString(value: CellValue) {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function createReportRows(filters: ReportFilters = {}) {
  return getPlatformDataset().then((dataset) => {
    const categoriesBySlug = Object.fromEntries(
      dataset.categories.map((category) => [category.slug, category]),
    );
    const trainingsBySlug = Object.fromEntries(
      dataset.trainings.map((training) => [training.slug, training]),
    );
    const scopedUsers = dataset.users.filter((user) =>
      filters.role ? user.role === filters.role : true,
    );
    const scopedUserIds = new Set(scopedUsers.map((user) => user.id));
    const scopedEnrollments = dataset.enrollments.filter((enrollment) =>
      scopedUserIds.has(enrollment.userId),
    );
    const scopedPayments = dataset.payments.filter((payment) =>
      scopedUserIds.has(payment.userId),
    );
    const usersById = Object.fromEntries(scopedUsers.map((user) => [user.id, user]));

    const paymentsByUserTraining = scopedPayments.reduce<Record<string, typeof scopedPayments>>(
      (accumulator, payment) => {
        const key = `${payment.userId}::${payment.trainingSlug}`;
        accumulator[key] = [...(accumulator[key] ?? []), payment].sort((left, right) =>
          right.paidAt.localeCompare(left.paidAt),
        );
        return accumulator;
      },
      {},
    );

    const users = [...scopedUsers]
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((user) => {
        const userEnrollments = scopedEnrollments.filter((item) => item.userId === user.id);
        const relevantEnrollment = getRelevantEnrollment(userEnrollments, trainingsBySlug);
        const training = relevantEnrollment
          ? trainingsBySlug[relevantEnrollment.trainingSlug]
          : undefined;
        const hasTraining = Boolean(
          training || user.currentTrainingName || user.trainingStartDate || user.trainingEndDate,
        );
        const startDate =
          training?.startDate ?? user.trainingStartDate ?? relevantEnrollment?.startedAt;
        const endDate =
          training?.endDate ?? user.trainingEndDate ?? relevantEnrollment?.completedAt;
        const phase = trainingPhase(startDate, endDate, relevantEnrollment?.status, hasTraining);
        const inTraining = isInTraining(
          startDate,
          endDate,
          relevantEnrollment?.status,
          hasTraining,
        );

        return {
          userId: user.uniqueId,
          recordId: user.id,
          fullName: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: formatSex(user.sex),
          age: user.age ?? null,
          post: `${formatRole(user.role)}${user.department ? ` / ${user.department}` : ""}`,
          role: formatRole(user.role),
          company: user.company,
          status: formatStatus(user.status),
          active: boolLabel(user.status === "active"),
          trainingState: phase,
          inTraining: boolLabel(inTraining),
          currentTraining: training?.title ?? user.currentTrainingName ?? "",
          trainingCode: training?.code ?? "",
          trainingCategory: training
            ? categoriesBySlug[training.categorySlug]?.name ?? training.categorySlug
            : "",
          trainingFormat: training?.format ?? "",
          trainerName: training?.trainerName ?? user.currentTrainerName ?? "",
          trainingStartDate: formatDate(startDate),
          trainingEndDate: formatDate(endDate),
          enrollmentStatus: formatStatus(relevantEnrollment?.status),
          progressPercent:
            relevantEnrollment?.progress !== undefined ? relevantEnrollment.progress : null,
          emailAddress: user.email,
          phoneNumber: user.phoneNumber ?? "",
          state: user.state ?? "",
          authProvider: formatAuthProvider(user),
          emailVerified: boolLabel(Boolean(user.emailVerified)),
          onboardingCompleted: boolLabel(Boolean(user.onboardingCompleted)),
          focusTracks: user.focusTracks.join(", "),
          joinedAt: formatDate(user.joinedAt),
          lastLoginAt: formatDateTime(user.lastLoginAt),
        };
      });

    const trainings = [...dataset.trainings]
      .sort((left, right) => left.title.localeCompare(right.title))
      .map((training) => {
        const enrollments = scopedEnrollments.filter(
          (enrollment) => enrollment.trainingSlug === training.slug,
        );

        return {
          trainingId: training.id,
          code: training.code,
          title: training.title,
          category: categoriesBySlug[training.categorySlug]?.name ?? training.categorySlug,
          level: training.level,
          format: training.format,
          status: formatStatus(training.status),
          trainerName: training.trainerName,
          trainerEmail: training.trainerEmail,
          startDate: formatDate(training.startDate),
          endDate: formatDate(training.endDate),
          durationDays: training.durationDays,
          totalHours: training.totalHours,
          seats: training.seats,
          enrolledUsers: enrollments.length,
          completionRate: training.completionRate,
          price: training.price,
          nextSession: formatDate(training.nextSession),
        };
      });

    const enrollments = [...scopedEnrollments]
      .sort((left, right) => right.startedAt.localeCompare(left.startedAt))
      .map((enrollment) => {
        const user = usersById[enrollment.userId];
        const training = trainingsBySlug[enrollment.trainingSlug];
        const payment =
          paymentsByUserTraining[`${enrollment.userId}::${enrollment.trainingSlug}`]?.[0];

        return {
          enrollmentId: enrollment.id,
          userId: user?.uniqueId ?? enrollment.userId,
          fullName: user?.name ?? "",
          gender: formatSex(user?.sex),
          age: user?.age ?? null,
          emailAddress: user?.email ?? "",
          phoneNumber: user?.phoneNumber ?? "",
          trainingCode: training?.code ?? enrollment.trainingSlug,
          trainingTitle: training?.title ?? enrollment.trainingSlug,
          trainingFormat: training?.format ?? "",
          trainerName: training?.trainerName ?? "",
          trainingStartDate: formatDate(training?.startDate ?? enrollment.startedAt),
          trainingEndDate: formatDate(training?.endDate ?? enrollment.completedAt),
          status: formatStatus(enrollment.status),
          inTraining: boolLabel(
            isInTraining(
              training?.startDate ?? enrollment.startedAt,
              training?.endDate ?? enrollment.completedAt,
              enrollment.status,
              true,
            ),
          ),
          progressPercent: enrollment.progress,
          amount: payment?.amount ?? enrollment.amount,
          company: user?.company ?? "",
          department: user?.department ?? "",
          startedAt: formatDateTime(enrollment.startedAt),
          nextSession: formatDateTime(enrollment.nextSession),
          completedAt: formatDateTime(enrollment.completedAt),
        };
      });

    const revenue = [...scopedPayments]
      .sort((left, right) => right.paidAt.localeCompare(left.paidAt))
      .map((payment) => {
        const user = usersById[payment.userId];
        const training = trainingsBySlug[payment.trainingSlug];

        return {
          invoiceNumber: payment.invoiceNumber,
          paymentId: payment.id,
          userId: user?.uniqueId ?? payment.userId,
          fullName: user?.name ?? "",
          emailAddress: user?.email ?? "",
          phoneNumber: user?.phoneNumber ?? "",
          trainingCode: training?.code ?? payment.trainingSlug,
          trainingTitle: training?.title ?? payment.trainingSlug,
          status: formatStatus(payment.status),
          provider: payment.provider,
          method: formatStatus(payment.method),
          amount: payment.amount,
          currency: payment.currency,
          paidAt: formatDateTime(payment.paidAt),
        };
      });

    const durations = [...dataset.trainings]
      .sort((left, right) => left.title.localeCompare(right.title))
      .map((training) => ({
        trainingCode: training.code,
        trainingTitle: training.title,
        category: categoriesBySlug[training.categorySlug]?.name ?? training.categorySlug,
        status: formatStatus(training.status),
        format: training.format,
        startDate: formatDate(training.startDate),
        endDate: formatDate(training.endDate),
        durationDays: training.durationDays,
        totalHours: training.totalHours,
        trainerName: training.trainerName,
        enrolledUsers: scopedEnrollments.filter(
          (enrollment) => enrollment.trainingSlug === training.slug,
        ).length,
      }));

    return { users, trainings, enrollments, revenue, durations };
  });
}

export async function buildExcelReport(report: ReportType, filters: ReportFilters = {}) {
  const rows = await createReportRows(filters);
  const workbook = XLSX.utils.book_new();

  if (report === "all") {
    for (const key of SHEET_ORDER) {
      buildSheet(workbook, SECTION_TITLES[key], EXCEL_COLUMNS[key], rows[key]);
    }
  } else {
    buildSheet(workbook, SECTION_TITLES[report], EXCEL_COLUMNS[report], rows[report]);
  }

  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
}

type SectionDrawer = {
  pdf: PDFDocument;
  font: PDFFont;
  bold: PDFFont;
};

function drawSection(
  { pdf, font, bold }: SectionDrawer,
  title: string,
  columns: ColumnDefinition[],
  entries: ReportRow[],
) {
  const pageWidth = PDF_PAGE.width;
  const pageHeight = PDF_PAGE.height;
  const headerHeight = 88;
  const tableHeaderHeight = 22;
  const rowHeight = 20;
  const usableWidth = pageWidth - PDF_PAGE.marginX * 2;
  const totalWidth = columns.reduce(
    (sum, column) => sum + (column.pdfWidth ?? column.width * 5),
    0,
  );
  const scale = totalWidth > usableWidth ? usableWidth / totalWidth : 1;
  const columnWidths = columns.map((column) =>
    Math.floor((column.pdfWidth ?? column.width * 5) * scale),
  );

  let page!: PDFPage;
  let y = 0;

  const drawHeader = () => {
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - PDF_PAGE.top;

    page.drawText(`Advancia Trainings - ${title}`, {
      x: PDF_PAGE.marginX,
      y,
      size: 18,
      font: bold,
      color: rgb(0.16, 0.06, 0.09),
    });
    y -= 22;

    page.drawText(
      `${entries.length} record${entries.length === 1 ? "" : "s"} - generated ${formatDate(new Date().toISOString())}`,
      {
        x: PDF_PAGE.marginX,
        y,
        size: 10,
        font,
        color: rgb(0.36, 0.33, 0.35),
      },
    );
    y -= 26;

    page.drawRectangle({
      x: PDF_PAGE.marginX,
      y: y - tableHeaderHeight + 4,
      width: usableWidth,
      height: tableHeaderHeight,
      color: rgb(0.95, 0.96, 0.98),
    });

    let x = PDF_PAGE.marginX + 4;
    columns.forEach((column, index) => {
      const cellWidth = columnWidths[index] - 8;
      page.drawText(fitText(column.label, bold, 8.5, cellWidth), {
        x,
        y: y - 10,
        size: 8.5,
        font: bold,
        color: rgb(0.18, 0.14, 0.16),
      });
      x += columnWidths[index];
    });

    y -= headerHeight;
  };

  drawHeader();

  if (entries.length === 0) {
    page.drawText("No records.", {
      x: PDF_PAGE.marginX,
      y,
      size: 10,
      font,
      color: rgb(0.36, 0.33, 0.35),
    });
    return;
  }

  entries.forEach((entry, index) => {
    if (y < PDF_PAGE.bottom + rowHeight) {
      drawHeader();
    }

    if (index % 2 === 0) {
      page.drawRectangle({
        x: PDF_PAGE.marginX,
        y: y - 4,
        width: usableWidth,
        height: rowHeight,
        color: rgb(0.985, 0.987, 0.99),
      });
    }

    let x = PDF_PAGE.marginX + 4;
    columns.forEach((column, columnIndex) => {
      const width = columnWidths[columnIndex] - 8;
      const text = fitText(toPdfString(entry[column.key]), font, 8, width);
      const textWidth = font.widthOfTextAtSize(text, 8);
      const drawX =
        column.align === "right"
          ? x + Math.max(0, width - textWidth)
          : column.align === "center"
            ? x + Math.max(0, (width - textWidth) / 2)
            : x;

      page.drawText(text, {
        x: drawX,
        y: y + 2,
        size: 8,
        font,
        color: rgb(0.16, 0.14, 0.15),
      });
      x += columnWidths[columnIndex];
    });

    y -= rowHeight;
  });
}

export async function buildPdfReport(report: ReportType, filters: ReportFilters = {}) {
  const rows = await createReportRows(filters);
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  if (report === "all") {
    for (const key of SHEET_ORDER) {
      drawSection({ pdf, font, bold }, SECTION_TITLES[key], PDF_COLUMNS[key], rows[key]);
    }
  } else {
    drawSection(
      { pdf, font, bold },
      SECTION_TITLES[report],
      PDF_COLUMNS[report],
      rows[report],
    );
  }

  return Buffer.from(await pdf.save());
}
