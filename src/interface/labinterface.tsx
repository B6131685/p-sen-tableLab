export interface RootDataLab {
    code: number
    status: string
    result: Result[]
  }
  
  export interface Result {
    data: Daum[]
    count: number
    total: number
    page: number
    pageCount: number
  }
  
  export interface Daum {
    testCode: string
    length: number
    data: Daum2[]
  }
  
  export interface Daum2 {
    createdAt: string
    id: number
    fileDatetime: string
    testCode: string
    result: Result2
    labNumber: string
    file: string
  }
  
  export interface Result2 {
    msh: Msh
    obr: Obr
    obx: Obx[]
    pid: Pid
  }
  
  export interface Msh {
    site: string
    systemName: string
    fileDatetime: string
  }
  
  export interface Obr {
    fileName: string
    testCode: string
    testName: string
    labNumber: string
    statusApprove: string
    approveDatetime: string
    approveUserCode: string
    authriseDatetime: string
    authriseUserCode: string
    labNumberCodeSeq: string
    authriseUserFullname: string
  }
  
  export interface Obx {
    unit: string
    result: string
    testCode: string
    testName: string
    flagLowHigh: string
    normalRange: string
  }
  
  export interface Pid {
    hn: string
    title: string
    lastname: string
    firstname: string
  }
  