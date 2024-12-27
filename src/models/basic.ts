export interface ISelectList {
  orderCode?: string;
  text: string;
  value: any;
}

export interface IFilter {
  search: string;
  sortBy?: string;
  orderType: "asc" | "desc";
  page: number;
  pageSize: number;
  totalRows?: number;
}

export interface IFields {
  key: string;
  label: string;
  sort?: boolean;
  isAmount?: boolean;
  tableList?: any[];
  type?: "input" | "selector" | "checkbox";
  itemNameValue?: string | "value";
  itemName?: string | "text";

  tdRowSpan?: number | string;
  tdColSpan?: number | string;
  thRowSpan?: number | string;
  thColSpan?: number | string;

  thClass?: number | string;
  tdClass?: number | string;
  removeChildParent?: boolean;
  children?: IFields[];
}

export interface IBreadCrumbs {
  text: string;
  disabled?: boolean;
  href: string;
}

export interface IBasicRequest {
  page: number;
  pageSize: number;
  total: number;
}

export interface IPagination {
  title: string;
  totalRows: number;
  firstNumber: number;
  lastNumber: number;
}

export interface ILanguageList {
  code: string;
  shortName: string;
  fullName: string;
  value: number;
  text: string;
  orderCode: string | null | number;
}

export interface ITableActions {
  isView?: boolean;
  isEdit?: boolean;
  isClone?: boolean;
  isDelete?: boolean;
  isHistory?: boolean;
  canAccept?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
  canApprove?: boolean;
  canSent?: boolean;
  canReject?: boolean;
  canRevoke?: boolean;
}

export interface IPerson {
  state: string;
  genderName: string;
  nationalityName: string;
  citizenshipName: string;
  birthCountryName: string;
  fullName: string;
  shortName: string;
  livingRegionName: string;
  livingDistrictName: string;
  livingMfyName: string;
  temporaryRegionName: string;
  temporaryDistrictName: string;
  temporaryMfyName: string;
  documentType: string;
  birthDateAsString: string;
  pinfl: string;
  passportSeria: string;
  passportDate: string;
  passportExpiration: string;
  surnameLatin: string;
  nameLatin: string;
  patronymLatin: string;
  surnameEng: string;
  nameEng: string;
  birthDate: string;
  passportDivName: string;
  kinshipDegree: string;
  id: number;
  inn: number | null;
  kinshipDegreeId: number | null;
  passportNumber: number | null;
  genderId: number | null;
  birthCountryId: number | null;
  nationalityId: number | null;
  citizenshipId: number | null;
  livingRegionId: number | null;
  livingDistrictId: number | null;
  livingMfyId: number | null;
  temporaryRegionId: number | null;
  temporaryDistrictId: number | null;
  temporaryMfyId: number | null;
  stateId: number | null;
  identityDocumentId: number | null;
  photo?: string;

  isTemporary: boolean;
}

export interface IGetPassportData {
  districtId: number | null;
  email: string | null;
  id: number | null;
  languageId: number | null;
  organizationId: number | null;
  password: string | null;
  personId: number | null;
  phoneNumber: null;
  regionId: null;
  roles: number[];
  stateId: number | null;
  userName: string | null;
  person: IPerson | null;
}

export interface IGetAuthInfo {
  fullName: string | null;
  organizationName: string | null;
  permissions: string[];
  shortName: string | null;
  userName: string | null;
}

export interface ITranslates {
  language?: string;
  columnName: string;
  languageId: number;
  translateText: string;
}

export interface ILogList {
  id: 0;
  dateAt: string;
  userInfo: string;
  tableId: number | null;
  userId: number | null;
  statusId: number | null;
  table: string;
  status: string;
  ipAddress: string;
  userAgent: string;
  message: string;
}

export interface IModalProps {
  title: string;
  id: number | null;
  cb: string;
}

export interface DefaultGetData extends ITableActions {
  id: number;
}

export interface IFileConfigBody {
  tableId: number;
  docOn: string;
  code?: string;
}

export interface IFileConfig {
  id: number | null;
  columnName: string;
  shortName: string;
  fullName: string;
  maxSize: number;
  isRequired: boolean;
  isMultiple: boolean;
  tables: IFileConfigTables[];
}

export interface IFileConfigTables {
  id: number | null;
  fileTypeId: number;
  fileType: string;
  extension: string;
}
