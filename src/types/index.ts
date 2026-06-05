export type CasteCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
export type Gender = 'Male' | 'Female' | 'Other'
export type MaritalStatus = 'Single' | 'Married' | 'Widowed' | 'Divorced'
export type EmploymentStatus = 'Employed' | 'Unemployed' | 'Self-Employed' | 'Student' | 'Retired'
export type Qualification = 'Below 10th' | '10th' | '12th' | 'Graduate' | 'Post Graduate' | 'PhD'
export type CollegeType = 'Government' | 'Private' | 'NA'
export type AreaType = 'Rural' | 'Urban'
export type SchemeCategory = 'Education' | 'Health' | 'Agriculture' | 'Employment' | 'Housing' | 'Women' | 'Senior Citizen' | 'Startup' | 'Skill Development' | 'Social Welfare'
export type EligibilityStatus = 'eligible' | 'partial' | 'not_eligible'

export interface UserProfile {
  fullName: string
  age: number
  gender: Gender
  maritalStatus: MaritalStatus
  disabilityStatus: boolean
  casteCategory: CasteCategory
  familyIncome: number
  employmentStatus: EmploymentStatus
  bplStatus: boolean
  isStudent: boolean
  qualification: Qualification
  collegeType: CollegeType
  state: string
  district: string
  areaType: AreaType
  isFarmer: boolean
  isWidow: boolean
  isSeniorCitizen: boolean
  isMinority: boolean
  isStartupOwner: boolean
  skillDevelopmentInterest: boolean
}

export interface SchemeRules {
  minAge?: number
  maxAge?: number
  incomeLimit?: number
  categories?: CasteCategory[]
  studentOnly?: boolean
  bplOnly?: boolean
  farmerOnly?: boolean
  widowOnly?: boolean
  seniorCitizenOnly?: boolean
  minorityOnly?: boolean
  startupOwnerOnly?: boolean
  skillDevelopmentOnly?: boolean
  disabilityOnly?: boolean
  genders?: Gender[]
  states?: string[]
  areaTypes?: AreaType[]
  qualifications?: Qualification[]
  employmentStatuses?: EmploymentStatus[]
}

export interface Scheme {
  id: string
  slug: string
  name: string
  nameHi: string
  description: string
  descriptionHi: string
  category: SchemeCategory
  ministry: string
  benefits: string[]
  benefitsHi: string[]
  documents: string[]
  documentsHi: string[]
  deadline?: string
  officialUrl: string
  applyUrl: string
  rules: SchemeRules
  featured: boolean
  popularity: number
  imageUrl?: string
}

export interface EligibilityResult {
  scheme: Scheme
  status: EligibilityStatus
  score: number
  matchedCriteria: string[]
  missedCriteria: string[]
}

export interface Feedback {
  id: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning'
  read: boolean
  createdAt: string
}
