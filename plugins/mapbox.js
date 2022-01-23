import Mapbox from "mapbox-gl";
import Vue from "vue";
import { MglGeolocateControl, MglMap } from "vue-mapbox";

Vue.component("MglMap", MglMap);
Vue.component("MglGeolocateControl", MglGeolocateControl);

Vue.prototype.$mapbox = Mapbox;
