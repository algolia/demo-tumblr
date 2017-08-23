export function recommendedBlogsDirective() {
    return {
        restrict: 'E'
        , controller: 'RecommendedBlogsController'
        , controllerAs: 'recommendedBlogsController'
        , bindToController: true
        , templateUrl: './app/components/recommended-blogs-component.html'
        , link: link
    };

    function link(scope, $element, attributes, ctrl) {}
}
class RecommendedBlogsController {
    static get $inject() {
        return ['searchStore'];
    }
    constructor(searchStore, $sce) {
        this._searchStore = searchStore;
    }
    get recommendedBlogs() {
        return this._searchStore.recommendedBlogs;
    }
}
export default RecommendedBlogsController;