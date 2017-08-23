export function searchControlsDirective() {
    return {
        restrict: 'E'
        , controller: 'SearchControlsController'
        , controllerAs: 'searchControlsController'
        , bindToController: true
        , templateUrl: './app/components/search-controls-component.html'
        , link: link
    };

    function link(scope, $element, attributes, ctrl) {}
}
class SearchControlsController {
    static get $inject() {
        return ['searchStore', 'INDEX', 'TIMESTAMP_INDEX'];
    }
    constructor(searchStore, INDEX, TIMESTAMP_INDEX) {
        this._searchStore = searchStore;
        this._INDEX = INDEX;
        this._TIMESTAMP_INDEX = TIMESTAMP_INDEX;
        this._postTypeVisible = false;
        this._sortOptionVisible = false;
    }
    
    get INDEX() {
        return this._INDEX;
    }
    
    get TIMESTAMP_INDEX() {
        return this._TIMESTAMP_INDEX;
    }

    get postTypes() {
        return ["text", "photo", "video"];
    }

    get currentType() {
        return this._searchStore.currentType;
    }

    get postTypeVisible() {
        return this._postTypeVisible;
    }
    
    get sortOptionVisible() {
        return this._sortOptionVisible;
    }

    togglePostTypeVisibility() {
        this._postTypeVisible = !this._postTypeVisible;
    }
    
    toggleSortOptionVisibility() {
        this._sortOptionVisible = !this._sortOptionVisible;
    }

    updatePostTypes(type) {
        this._postTypeVisible = false;
        this._searchStore.updatePostsOfType(type);
    }
    
    updatePostsIndex(index) {
        this._sortOptionVisible = false;
        this._searchStore.updatePostsIndex(index);
    }
}
export default SearchControlsController;