// types/country.types.ts
export interface State {
  name: string;
  state_code: string;
}

export interface CountryStatesResponse {
  error: boolean;
  msg: string;
  data: {
    name: string;
    iso3: string;
    states: State[];
  };
}

export interface CitiesResponse {
  error: boolean;
  msg: string;
  data: string[];
}

export interface CityRequest {
  country: string;
  state: string;
}