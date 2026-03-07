// services/location.service.ts
import { CountryStatesResponse, CitiesResponse, State, CityRequest } from '@/types/country';

class LocationService {
  private statesBaseURL = 'https://countriesnow.space/api/v0.1/countries/states';
  private citiesBaseURL = 'https://countriesnow.space/api/v0.1/countries/state/cities';

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

      if (useCache && this.statesCache.has(cacheKey)) {
        console.log(`Returning cached states for ${country}`);
        return this.statesCache.get(cacheKey)!;
      }

      const response = await fetch(this.statesBaseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country }),
      });

      if (!response.ok) {
        console.warn(`States API returned ${response.status} for country: ${country}`);
        return [];
      }

      const data: CountryStatesResponse = await response.json();

      if (data.error) {
        console.warn(`States API error for ${country}:`, data.msg);
        return [];
      }

      this.statesCache.set(cacheKey, data.data.states);
      return data.data.states;

    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
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
    const normalizedState = state.replace(/\s*state$/i, '').trim();
    const cacheKey = `${country.toLowerCase()}_${normalizedState.toLowerCase()}`;

    if (useCache && this.citiesCache.has(cacheKey)) {
      return this.citiesCache.get(cacheKey)!;
    }

    // Try primary endpoint
    let response = await fetch(this.citiesBaseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, state: normalizedState }),
    });

    // If that fails, try with the original (un-normalized) state name
    if (!response.ok) {
      response = await fetch(this.citiesBaseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, state }),
      });
    }

    if (!response.ok) return [];

    const data: CitiesResponse = await response.json();
    if (data.error || !data.data?.length) return [];

    this.citiesCache.set(cacheKey, data.data);
    return data.data;

  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

  /**
   * Search states by name or code
   */
  async searchStates(country: string, searchTerm: string): Promise<State[]> {
    try {
      const states = await this.getStates(country);
      const term = searchTerm.toLowerCase();
      return states.filter(
        (state) =>
          state.name.toLowerCase().includes(term) ||
          state.state_code.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching states:', error);
      return [];
    }
  }

  /**
   * Search cities in a state
   */
  async searchCities(country: string, state: string, searchTerm: string): Promise<string[]> {
    try {
      const cities = await this.getCities(country, state);
      const term = searchTerm.toLowerCase();
      return cities.filter((city) => city.toLowerCase().includes(term));
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  }

  /**
   * Get state by code
   */
  async getStateByCode(country: string, stateCode: string): Promise<State | null> {
    try {
      const states = await this.getStates(country);
      return states.find((s) => s.state_code.toLowerCase() === stateCode.toLowerCase()) || null;
    } catch (error) {
      console.error('Error getting state by code:', error);
      return null;
    }
  }

  /**
   * Clear cache for specific country or all
   */
  clearCache(country?: string): void {
    if (country) {
      const countryKey = country.toLowerCase();
      this.statesCache.delete(countryKey);
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
  getCacheStats(): { statesCacheSize: number; citiesCacheSize: number } {
    return {
      statesCacheSize: this.statesCache.size,
      citiesCacheSize: this.citiesCache.size,
    };
  }
}

export default new LocationService();