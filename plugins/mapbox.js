import Vue from "vue";
import { MglGeolocateControl, MglMap } from "vue-mapbox";
import Mapbox from "mapbox-gl";

Vue.component("MglMap", MglMap);
Vue.component("MglGeolocateControl", MglGeolocateControl);

Vue.prototype.$mapbox = Mapbox;
