// services/location.service.ts
import { CountryStatesResponse, CitiesResponse, State, CityRequest } from '@/types/country';

class LocationService {
  private baseURL = 'https://countriesnow.space/api/v0.1/countries';
  
  // Cache for states and cities to reduce API calls
  private statesCache: Map<string, State[]> = new Map();
  private citiesCache: Map<string, string[]> = new Map();
  
  /**
   * Get all states for a country
   * @param country - Country name
   * @param useCache - Whether to use cached data (default: true)
   */
  async getStates(country: string, useCache: boolean = true): Promise<State[]> {
    try {
      const cacheKey = country.toLowerCase();
      
      // Return cached data if available
      if (useCache && this.statesCache.has(cacheKey)) {
        console.log(`Returning cached states for ${country}`);
        return this.statesCache.get(cacheKey)!;
      }
      
      const response = await fetch(`${this.baseURL}/states`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CountryStatesResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.msg);
      }
      
      // Cache the result
      this.statesCache.set(cacheKey, data.data.states);
      
      return data.data.states;
      
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error;
    }
  }
  
  /**
   * Get cities for a specific state in a country
   * @param country - Country name
   * @param state - State name
   * @param useCache - Whether to use cached data (default: true)
   */
  async getCities(country: string, state: string, useCache: boolean = true): Promise<string[]> {
    try {
      const cacheKey = `${country.toLowerCase()}_${state.toLowerCase()}`;
      
      // Return cached data if available
      if (useCache && this.citiesCache.has(cacheKey)) {
        console.log(`Returning cached cities for ${state}, ${country}`);
        return this.citiesCache.get(cacheKey)!;
      }
      
      const requestBody: CityRequest = { country, state };
      
      const response = await fetch(`${this.baseURL}/state/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CitiesResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.msg);
      }
      
      // Cache the result
      this.citiesCache.set(cacheKey, data.data);
      
      return data.data;
      
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }
  
  /**
   * Search states by name or code
   * @param country - Country name
   * @param searchTerm - Search term for state name or code
   */
  async searchStates(country: string, searchTerm: string): Promise<State[]> {
    try {
      const states = await this.getStates(country);
      
      const term = searchTerm.toLowerCase();
      return states.filter(state => 
        state.name.toLowerCase().includes(term) || 
        state.state_code.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching states:', error);
      throw error;
    }
  }
  
  /**
   * Search cities in a state
   * @param country - Country name
   * @param state - State name
   * @param searchTerm - Search term for city name
   */
  async searchCities(country: string, state: string, searchTerm: string): Promise<string[]> {
    try {
      const cities = await this.getCities(country, state);
      
      const term = searchTerm.toLowerCase();
      return cities.filter(city => 
        city.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching cities:', error);
      throw error;
    }
  }
  
  /**
   * Get state by code
   * @param country - Country name
   * @param stateCode - State code (e.g., 'LA' for Lagos)
   */
  async getStateByCode(country: string, stateCode: string): Promise<State | null> {
    try {
      const states = await this.getStates(country);
      const state = states.find(s => 
        s.state_code.toLowerCase() === stateCode.toLowerCase()
      );
      return state || null;
    } catch (error) {
      console.error('Error getting state by code:', error);
      throw error;
    }
  }
  
  /**
   * Clear cache for specific country or all
   * @param country - Optional country to clear cache for
   */
  clearCache(country?: string): void {
    if (country) {
      const countryKey = country.toLowerCase();
      this.statesCache.delete(countryKey);
      
      // Clear all cities for this country
      for (const key of this.citiesCache.keys()) {
        if (key.startsWith(countryKey)) {
          this.citiesCache.delete(key);
        }
      }
    } else {
      this.statesCache.clear();
      this.citiesCache.clear();
    }
  }
  
  /**
   * Get cache statistics
   */
  getCacheStats(): {
    statesCacheSize: number;
    citiesCacheSize: number;
  } {
    return {
      statesCacheSize: this.statesCache.size,
      citiesCacheSize: this.citiesCache.size,
    };
  }
}

export default new LocationService();