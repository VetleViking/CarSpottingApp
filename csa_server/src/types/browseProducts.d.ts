export interface BrowseProducts {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
  aggregations: Aggregations;
  suggest: Suggest;
  searchType: string;
  otherSegments: OtherSegments;
}

export interface Shards {
  total: number;
  successful: number;
  failed: number;
}

export interface Aggregations {
  Allergens: Allergens;
  Categories: Allergens;
  IsBargain: Is;
  AssortmentCode: Allergens;
  IsOffer: Is;
}

export interface Allergens {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: AllergensBucket[];
}

export interface AllergensBucket {
  key: string;
  doc_count: number;
}

export interface Is {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: IsBargainBucket[];
}

export interface IsBargainBucket {
  key: number;
  key_as_string: string;
  doc_count: number;
}

export interface Hits {
  total: number;
  max_score: number;
  hits: Hit[];
}

export interface Hit {
  contentType: Type;
  title: string;
  description: string;
  contentId: string;
  imageId: string;
  contentData: ContentData;
}

export interface ContentData {
  _index: Index;
  _type: Type;
  _id: string;
  _score: number;
  _source: Source;
  sort: number[];
}

export enum Index {
  NgProducts1210_18042024_075528 = "ng_products_1210_18.04.2024_07:55:28",
}

export interface Source {
  unitWeight: null;
  shoppingListGroupName: ShoppingListGroupName;
  imagePath: string;
  title: string;
  categoryName: CategoryName;
  calcUnit: Unit;
  pricePerUnit: number;
  unitType: UnitType;
  ageLimit: number;
  recycleValue: number;
  ean: string;
  vendor: Vendor;
  comparePricePerUnit: number;
  isForSale: boolean;
  productByWeightSoldAsItem: boolean;
  containsAlcohol: boolean;
  calcUnitType: UnitType;
  compareUnit: CompareUnit;
  calcPricePerUnit: number;
  isOffer: boolean;
  weight: number;
  isFreshProduce: boolean;
  isNew: boolean;
  environmentalCodes: EnvironmentalCode[];
  slugifiedUrl: string;
  unitRule: number;
  productSoldByWeight: boolean;
  imageGtin: string;
  isLocal: boolean;
  isOutOfStock: boolean;
  unitRules: number;
  unit: Unit;
  epdNumber: number;
  promotions: any[];
  pricePerUnitOriginal: number;
  subtitle: string;
  mustOrderFromSupplier: boolean;
  usesPromotionPrice: boolean;
  promotionDisplayName: string;
  promotionId: null;
  coupon: null;
  brand?: string;
}

export enum Unit {
  Stk = "stk",
}

export enum UnitType {
  Stykk = "Stykk",
}

export enum CategoryName {
  Drikke = "Drikke",
}

export enum CompareUnit {
  L = "l",
}

export interface EnvironmentalCode {
  displayName: Name;
  name: Name;
  code?: string;
}

export enum Name {
  EMerket = "e_merket",
  Plastpiler = "plastpiler",
}

export enum ShoppingListGroupName {
  Energidrikk = "Energidrikk",
}

export enum Vendor {
  CocaColaEuropacificPartnersNorgeAs = "Coca-cola europacific partners norge as",
  RedBullNorwayAs = "Red bull norway as",
  RingnesAs = "Ringnes as",
  Unil = "Unil",
}

export enum Type {
  Product = "product",
}

export interface OtherSegments {
  articles: number;
  recipes: number;
  stores: number;
}

export interface Suggest {
  simple_phrase: SimplePhrase[];
}

export interface SimplePhrase {
  text: string;
  offset: number;
  length: number;
  options: Option[];
}

export interface Option {
  text: string;
  highlighted: string;
  score: number;
}
