import { environment } from '../../../../environments/environment';

const BASE_URL = environment.fixerAPIURL;

export default {
    symbols: `${BASE_URL}/symbols`,
    latestCurrencies: `${BASE_URL}/latest`
};
