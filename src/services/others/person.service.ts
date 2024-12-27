import ApiService from "../api.service";

const PersonService = {
  // GetByPassportData(Seria: string, Number: string, DateOfBirth: string, documentTypeId: number) {
  //   return ApiService.get(`/Person/GetByPassportData?Seria=${Seria}&Number=${Number}&DateOfBirth=${DateOfBirth}&documentTypeId=${documentTypeId}`);
  // },
  GetByPassportData(data: any) {
    return ApiService.post(`/Person/GetByPassportData`, data);
  },
  GetPersonFamily(data: any) {
    return ApiService.post("Person/GetPersonFamily", data);
  },
  GetPersonFamilyV2(data: any) {
    return ApiService.post("Person/GetPersonFamilyV2", data);
  },
  GetPersonFamilyV3(data: any) {
    return ApiService.post("Person/GetPersonFamilyV3", data);
  },
  GetPhotoFromGSP(id: any) {
    return ApiService.get(`/Person/GetPhotoFromGSP/${id}`);
  }
};
export default PersonService;
