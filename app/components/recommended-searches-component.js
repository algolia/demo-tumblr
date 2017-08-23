export function recommendedSearchesDirective() {
    return {
        restrict: 'E'
        , controller: 'RecommendedSearchesController'
        , controllerAs: 'recommendedSearchesController'
        , bindToController: true
        , templateUrl: './app/components/recommended-searches-component.html'
        , link: link
    };

    function link(scope, $element, attributes, ctrl) {}
}
class RecommendedSearchesController {
    static get $inject() {
        return ['searchStore'];
    }
    constructor(searchStore, $sce) {
        this._searchStore = searchStore;
    }
    get recommendedSearches() {
        return this._searchStore.recommendedSearches;
    }
    updateSearch(result) {
        this._searchStore.addTag(result);
    }
}
export default RecommendedSearchesController;