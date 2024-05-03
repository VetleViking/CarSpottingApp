export interface Products {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
  aggregations: Aggregations;
  suggest: Suggest;
  searchType: string;
}

export interface Shards {
  total: number;
  successful: number;
  failed: number;
}

export interface Aggregations {
  Allergens: Allergens;
  Categories: Allergens;
}

export interface Allergens {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: Bucket[];
}

export interface Bucket {
  key: string;
  doc_count: number;
}

export interface Hits {
  total: number;
  max_score: number;
  hits: Hit[];
}

export interface Hit {
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
  isMedicin: boolean;
  shoppingListGroupName: string;
  imagePath: string;
  pricePerUnit: number;
  recycleValue: number;
  vitaminsMinerals: NutritionalContent[];
  measurementType: MeasurementType;
  shoppingListGroupIds: number[];
  brand?: string;
  isForSale: boolean;
  productByWeightSoldAsItem: boolean;
  weight: number;
  isFreshProduce: boolean;
  environmentalCodes: Allergen[];
  unitRule: number;
  productSoldByWeight: boolean;
  unit: CalcUnitEnum;
  pricePerUnitOriginal: number;
  isBreadAndCanSlice: boolean;
  subtitle: string;
  mustOrderFromSupplier: boolean;
  shoppingListGroupName1?: string;
  unitWeight: number | null;
  measurementValue: number;
  supplierId: number;
  leadTime: any[];
  packageSize?: string;
  title: string;
  assortmentGroup: any[];
  categoryName: string;
  calcUnit: CalcUnitEnum;
  alcoholPercentage: number;
  unitType: UnitType;
  nutritionalContent: NutritionalContent[];
  ageLimit: number;
  ean: string;
  vendor: string;
  comparePricePerUnit: number | null;
  servingSize: number;
  organic: boolean;
  containsAlcohol: boolean;
  calcUnitType: UnitType;
  compareUnit: CalcUnitEnum;
  calcPricePerUnit: number;
  isOffer: boolean;
  isNew: boolean;
  storeId: string;
  slugifiedUrl: string;
  imageGtin: string;
  isLocal: boolean;
  isOutOfStock: boolean;
  allergens: Allergen[];
  unitRules: number;
  epdNumber: number;
  promotions: Promotion[];
  guidelineDailyAmount: any[];
  countryOfOrigin: CountryOfOrigin;
  usesPromotionPrice: boolean;
  promotionDisplayName: PromotionDisplayName;
  promotionId: number | null;
  coupon: null;
  description?: null | string;
  storage?: Storage;
  associated?: Associated;
  relevantInfo?: string;
  shoppingListGroupName2?: string;
  minimumDurability?: number;
  allergyDeclaration?: string;
  ingredients?: string;
}

export interface Allergen {
  code?: string;
  displayName: string;
  name: string;
}

export interface Associated {
  products: string[];
  slg: string[];
}

export enum CalcUnitEnum {
  Empty = "",
  Kg = "kg",
  L = "l",
  Stk = "stk",
}

export enum UnitType {
  Kilo = "Kilo",
  Stykk = "Stykk",
}

export enum CountryOfOrigin {
  CostaRica = "Costa Rica",
  Norge = "Norge",
  Spania = "Spania",
}

export enum MeasurementType {
  C = "c",
  G = "g",
  Ml = "ml",
}

export interface NutritionalContent {
  amount: number;
  unit: NutritionalContentUnit;
  displayName: string;
  name: string;
}

export enum NutritionalContentUnit {
  G = "g",
  Kcal = "kcal",
  Kj = "kj",
  Mg = "mg",
  Μmg = "µmg",
}

export enum PromotionDisplayName {
  Empty = "",
  Tilbud = "Tilbud",
}

export interface Promotion {
  hasPriority: boolean;
  promotionPrice?: number;
  promoComparePricePerUnit: number | null;
  promoCompareUnitType?: UnitType;
  type: number;
  trumfCampaign: boolean;
  promoPricePerUnit?: number;
  promotionId: number;
  comparablePrice: number | null;
  isMarketed: boolean;
  from: Date;
  marketText?: PromotionDisplayName;
  weightProduct: boolean;
  promoCalcUnitType?: UnitType;
  promoCalcPricePerUnit: number | null;
  promoCompareUnit?: CalcUnitEnum;
  tags: string[];
  promoMarketText?: PromotionDisplayName;
  promoName: string;
  alternativePrice: null;
  promoCalcUnit?: CalcUnitEnum;
  name: string;
  to: Date;
  promoUnit?: CalcUnitEnum;
  status: number;
  promoUnitType?: UnitType;
  fulfillmentThreshold?: null;
  mixMatchPriority?: number;
}

export interface Storage {
  maxTemperature: number;
  minTemperature: number;
}

export enum Type {
  Product = "product",
}

export interface Suggest {
  simple_phrase: SimplePhrase[];
}

export interface SimplePhrase {
  text: string;
  offset: number;
  length: number;
  options: any[];
}
