import _ from 'lodash';
import algoliasearch from 'algoliasearch';

export function searchInputDirective() {
    return {
        restrict: 'E',
        controller: 'SearchInputController',
        controllerAs: 'searchInputController',
        bindToController: true,
        templateUrl: './app/components/search-input-component.html',
        link: link
    };

    function link() {

    }
}

class SearchInputController {

    static get $inject() {
        return ['searchStore', '$sce'];
    }

    constructor(searchStore, $sce) {
        this._searchStore = searchStore;
        this._$sce = $sce;
    }

    get displayResults() {
        return this._searchStore.displayResults;
    }

    get tagsResults() {
        return this._searchStore.tagsResults;
    }

    get blogResults() {
        return this._searchStore.blogResults;
    }

    get currentTags() {
        return this._searchStore.currentTags;
    }

    get query() {
        return this._searchStore.query;
    }

    set query(value) {
        this._searchStore.query = value;
    }

    renderHtml(text) {
        return this._$sce.trustAsHtml(text);
    }

    searchQuery() {
        this._searchStore.updateQuery(this.currentTags);
    }

    updateSearch(result) {
        this._searchStore.addTag(result);
    }

    removeTag(tag) {
        this._searchStore.removeTag(tag);
    }
    
    enterInput(query) {
        this._searchStore.addTag(query);
    }
}

export default SearchInputController;