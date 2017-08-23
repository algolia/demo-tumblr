import _ from 'lodash';
import algoliasearch from 'algoliasearch';
class SearchStore {
    static get $inject() {
        return ['APP_ID', 'API_KEY', 'INDEX', 'TIMESTAMP_INDEX', '$rootScope'];
    }
    constructor(APP_ID, API_KEY, INDEX, TIMESTAMP_INDEX, $rootScope) {
        this._APP_ID = APP_ID;
        this._API_KEY = API_KEY;
        this._INDEX = INDEX;
        this._TIMESTAMP_INDEX = TIMESTAMP_INDEX;
        this._$rootScope = $rootScope;
        this._client = algoliasearch(this._APP_ID, this._API_KEY);
        this._releventIndexInit = this._client.initIndex(this._INDEX);
        this._currentIndex = this._INDEX;
        this.query = "";
        this._displayResults = false;
        this._currentTags = [];
        this._currentType = "";
        this._currentPage = 0;
        this._isFirstLoad = true;
        this._updateView(this._currentTags, this._currentType, this._currentIndex);
    }
    get displayResults() {
        return this._displayResults;
    }
    get tagsResults() {
        return this._tagsResults;
    }
    get blogResults() {
        return this._blogResults;
    }
    get postsResults() {
        return this._postsResults;
    }
    get currentTags() {
        return this._currentTags;
    }
    get currentType() {
        return this._currentType;
    }
    get currentIndex() {
        return this._currentIndex;
    }
    get recommendedSearches() {
        return this._recommendedSearches;
    }
    get recommendedBlogs() {
        return this._recommendedBlogs;
    }
    get blackList() {
        return ["420", "vape", "weed", "vapelife", "sexy", "cannabis", "marijuana", "stoner", "high", "smoke weed", "pot", "ganja", "smoke"];
    }
    getFirstLetter(str) {
        return _.first(str);
    }
    orderTags(tags) {
        return _.reverse(_.sortBy(tags, tag => tag.matchLevel === 'full' || tag.matchLevel === 'partial'));
    }
    addTag(tag) {
        this._displayResults = false;
        this._currentPage = 0;
        this._clearImgUrls();
        this._currentTags = this._currentTags.concat(tag);
        this._updateView(this._currentTags, this._currentType, this._currentIndex);
    }
    removeTag(tag) {
        this._currentPage = 0;
        this._clearImgUrls();
        this._currentTags = _.without(this._currentTags, tag);
        this._updateView(this._currentTags, this._currentType, this._currentIndex);
    }
    _clearImgUrls() {
        for (let post of this._postsResults) {
            post.image.url = "";
        }
    }
    _updateView(currentTags, currentType, currentIndex) {
        this._updatePosts(currentTags, currentType, currentIndex);
        this._updateRecommendedSearches(currentTags);
        this._updateRecommendedBlogs(currentTags);
    }
    _createKeywordQuery(currentTags) {
        return currentTags.join(" ");
    }
    _updatePosts(currentTags, currentType, currentIndex) {
        this._client.initIndex(currentIndex).search(this._createKeywordQuery(currentTags), {
            hitsPerPage: 40
            , filters: currentType != "" ? "(type:" + currentType + ")" : ""
            , page: this._currentPage
        }).then((results) => {
            this._postsResults = this._currentPage > 0 ? this._postsResults.concat(results.hits) : results.hits;
            this.query = "";
            this._displayResults = false;
            this._$rootScope.$evalAsync();
        }).catch(err => this._handleFetchError(err));
    }
    _updateRecommendedSearches(currentTags) {
        this._releventIndexInit.searchFacet('', 'tags', {
            hitsPerPage: 5
            , filters: this._createFilterQuery(currentTags)
        }).then((tagsResults) => {
            if (tagsResults.facetHits.length > 0) {
                this._recommendedSearches = _.difference(tagsResults.facetHits.map(facet => facet.value), _.concat(currentTags, this.blackList));
                this._$rootScope.$evalAsync();
            }
            else {
                this._releventIndexInit.search('', {
                    facets: "*"
                }).then((results) => {
                    this._recommendedSearches = _.difference(Object.keys(results.facets.tags), _.concat(currentTags, this.blackList));
                    this._$rootScope.$evalAsync();
                });
            }
        }).catch(err => this._handleFetchError(err));
    }
    _updateRecommendedBlogs(currentTags) {
        this._releventIndexInit.searchFacet('', 'blog_name', {
            hitsPerPage: 5
            , filters: this._createFilterQuery(currentTags)
        }).then((tagsResults) => {
            if (this._isFirstLoad) {
                this._releventIndexInit.search('', {
                    facets: "*"
                }).then((results) => {
                    this._isFirstLoad = false;
                    this._recommendedBlogs = Object.keys(results.facets.blog_name);
                    this._$rootScope.$evalAsync();
                });
            }
            else {
                if (tagsResults.facetHits.length > 0) {
                    this._recommendedBlogs = tagsResults.facetHits.map(facet => facet.value);
                    this._$rootScope.$evalAsync();
                }
                else {
                    this._releventIndexInit.search(this.query, {
                        facets: "*"
                    }).then((results) => {
                        this._recommendedBlogs = Object.keys(results.facets.blog_name);
                        this._$rootScope.$evalAsync();
                    });
                }
            }
        }).catch(err => this._handleFetchError(err));
    }
    _createFilterQuery(currentTags) {
        return currentTags.length > 0 ? '(' + currentTags.map(tag => 'tags:' + "'" + tag + "'").join(" AND ") + ')' : '';
    }
    updateQuery(currentTags) {
        this._releventIndexInit.searchFacet(this.query, 'tags', {
            hitsPerPage: 5
            , filters: this._createFilterQuery(currentTags)
        }).then(
            (tagsResults) => {
                this._tagsResults = tagsResults;
                return this._releventIndexInit.searchFacet(this.query, 'blog_name', {
                    hitsPerPage: 5
                    , filters: this._createFilterQuery(currentTags)
                });
            }).then(
            (blogResults) => {
                this._blogResults = blogResults;
                this._$rootScope.$evalAsync();
                this._displayResults = true;
            }).catch(err => this._handleFetchError(err));
    }
    _handleFetchError(err) {
        console.log(err);
    }
    updatePostsOfType(type) {
        this._currentType = type;
        this._currentPage = 0;
        this._updatePosts(this._currentTags, this._currentType, this._currentIndex);
    }
    updatePostsIndex(index) {
        this._currentIndex = index;
        this._currentPage = 0;
        this._updatePosts(this._currentTags, this._currentType, this._currentIndex);
    }
    updatePagination() {
        this._currentPage++;
        this._updatePosts(this._currentTags, this._currentType, this._currentIndex);
        console.log(this._currentPage);
    }
}
export default SearchStore;