import { BACKEND_BASE_URL } from "@/constants"
import { ListResponse, GetOneResponse, CreateResponse } from "@/types";
import { HttpError } from "@refinedev/core";
import{createDataProvider, CreateDataProviderOptions} from "@refinedev/rest"

if (!BACKEND_BASE_URL){
  throw new Error('BACKEND_BASE_URL is not configured. Please set VITE_BACKEND_URL in your .env file.')
}

// getList/getOne/create/update don't check response.ok before parsing the
// body, so a missing route (an HTML 404 page, or a JSON {error} body)
// surfaces as a cryptic JSON.parse error. This builds a clean,
// HttpError-shaped message instead.
const buildHttpError = async (response: Response, resource?: string): Promise<HttpError> => {
  if (response.status === 404 && resource) {
    return {
      message: `"${resource}" isn't implemented on the backend yet (404).`,
      statusCode: 404,
    };
  }

  let message = `Request failed (${response.status}).`;
  if (response.headers.get("content-type")?.includes("application/json")) {
    try {
      const body = (await response.json()) as { error?: string; message?: string };
      message = body?.error ?? body?.message ?? message;
    } catch {
      // body wasn't valid JSON either; keep the generic message
    }
  }

  return { message, statusCode: response.status };
};

const options:CreateDataProviderOptions ={
getList:{
  buildQueryParams: async ({ filters, pagination }) => {
    const query: Record<string, unknown> = {};

    filters?.forEach((filter) => {
      if ("field" in filter && filter.value !== undefined && filter.value !== "") {
        query[filter.field] = filter.value;
      }
    });

    if (pagination?.currentPage) query.page = pagination.currentPage;
    if (pagination?.pageSize) query.limit = pagination.pageSize;

    return query;
  },
  mapResponse:async (response, params) => {
    if (!response.ok) throw await buildHttpError(response, params.resource);
    const payload:ListResponse =await response.json();
    return payload.data ?? [];
  },
  getTotalCount:async (response, params)=>{
    if (!response.ok) throw await buildHttpError(response, params.resource);
    const payload:ListResponse = await response.json();
    // Postgres COUNT(*) is serialized as a string; coerce so consumers doing
    // `typeof total === "number"` (e.g. the pagination row-count label) work.
    return Number(payload.pagination?.total ?? payload.data?.length ?? 0);
  }
  },
getOne:{
  mapResponse: async (response, params) => {
    if (!response.ok) throw await buildHttpError(response, params.resource);
    const payload: GetOneResponse<Record<string, unknown>> = await response.json();
    // The departments show endpoint nests the record under `data.department`
    // alongside a `totals` summary -- flatten department fields to the top
    // level (so useForm's edit page keeps working unchanged) while keeping
    // `totals` accessible for the show page.
    if (params.resource === "departments") {
      const data = payload.data as { department?: Record<string, unknown>; totals?: unknown } | undefined;
      if (data?.department) return { ...data.department, totals: data.totals };
      return data;
    }
    return payload.data;
  },
},
create:{
  mapResponse: async (response, params) => {
    if (!response.ok) throw await buildHttpError(response, params.resource);
    const payload: CreateResponse<Record<string, unknown>> = await response.json();
    return payload.data ?? {};
  },
},
update:{
  getRequestMethod: () => "put",
  mapResponse: async (response, params) => {
    if (!response.ok) throw await buildHttpError(response, params.resource);
    const payload: CreateResponse<Record<string, unknown>> = await response.json();
    return payload.data ?? {};
  },
},
}

const { dataProvider, kyInstance } = createDataProvider(BACKEND_BASE_URL, options, {
  credentials: "include",
});

export { dataProvider, kyInstance };
