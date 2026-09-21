import { BACKEND_BASE_URL } from "@/constants"
import { ListResponse } from "@/types";
import{createDataProvider, CreateDataProviderOptions} from "@refinedev/rest"

if (!BACKEND_BASE_URL){
  throw new Error('BACKEND_BASE_URL is not configured. Please set VITE_BACKEND_URL in your .env file.')
}


const options:CreateDataProviderOptions ={
getList:{
  getEndpoint:({resource}) => resource,
  buildQueryParams: async ({ filters, pagination }) => {
    const query: Record<string, unknown> = {};

    filters?.forEach((filter) => {
      if ("field" in filter) {
        if (filter.field === "name") query.search = filter.value;
        if (filter.field === "department") query.department = filter.value;
      }
    });

    if (pagination?.currentPage) query.page = pagination.currentPage;
    if (pagination?.pageSize) query.limit = pagination.pageSize;

    return query;
  },
  mapResponse:async (response) => {
    const payload:ListResponse =await response.json();
    return payload.data ?? [];
  },
  getTotalCount:async (response)=>{
    const payload:ListResponse = await response.json();
 return payload.pagination?.total ?? payload.data?.length ?? 0;
  }
  }

}

const { dataProvider } =createDataProvider(BACKEND_BASE_URL,options);

export { dataProvider};