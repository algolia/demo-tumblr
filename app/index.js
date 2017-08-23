import angular from 'angular';
import _ from 'lodash';

import SearchStore from './search-store.js';
import SearchInputController, { searchInputDirective } from './components/search-input-component.js';
import PostController, { postDirective } from './components/post-component.js';
import RecommendedSearchesController, { recommendedSearchesDirective } from './components/recommended-searches-component.js';
import RecommendedBlogsController, { recommendedBlogsDirective } from './components/recommended-blogs-component.js';
import SearchControlsController, { searchControlsDirective } from './components/search-controls-component.js';

export default angular
.module('Algolia.DemoSearch', [])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }])
    .constant('APP_ID', 'DR2TUOO6YG')
    .constant('API_KEY', '2393ec1a803a7b6a404907dd4de84826')
    .constant('INDEX', 'posts_v2')
    .constant('TIMESTAMP_INDEX', 'posts_v2_desc_timestamp')
    .service('searchStore', SearchStore)
    .controller('SearchInputController', SearchInputController)
    .directive('searchInput', searchInputDirective)
    .controller('PostController', PostController)
    .directive('postComponent', postDirective)
    .controller('RecommendedSearchesController', RecommendedSearchesController)
    .directive('recommendedSearchesComponent', recommendedSearchesDirective)
    .controller('RecommendedBlogsController', RecommendedBlogsController)
    .directive('recommendedBlogsComponent', recommendedBlogsDirective)
    .controller('SearchControlsController', SearchControlsController)
    .directive('searchControlsComponent', searchControlsDirective);

angular.element(document).ready(function () {
    angular.bootstrap(document.getElementById("AlgoliaSearch"), ['Algolia.DemoSearch']);
})