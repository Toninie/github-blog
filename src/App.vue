<template>
    <div id="app">
        <app-header></app-header>
        <section ref="context" class="context" @scroll="onScrolling" @click="isNav = false">
            <router-view ref="context-view" :issues="issues" @loading="setLoading">
            </router-view>
            <div v-show="loading" class="loading-tips">
                <div class="icon-spinner"></div>
                <p>loading</p>
            </div>
        </section>

        <div class="hidden-btns icon-circle-down" :class="{'active': isNav}" @click="isNav = !isNav"></div>
        <app-nav ref="app-nav" :labels="labels"></app-nav>

        <footer class="main">
            <p>Powered By <a href="http://github.com">Github</a></p>
        </footer>
    </div>
</template>
<script>
    import 'normalize.css';
    import './style/main.css';
    import './style/icomoon/style.css';

    import { http } from './gitment/utils';
    import { OWNER, REPO, TITLE } from './config';

    import appHeader from './components/header';

    export default {
        name: 'app',
        components: {
            appHeader
        },
        data () {
            return {
                page: 1,
                label: '',
                issues: [],
                timer: 0,
                loading: false,
                isPause: false,
                labels: null,
                isNav: false
            }
        },
        watch: {
            '$route.path': {
                immediate: true,
                handler(path) {
                    if ( path === '/' || path.match(/^\/label\//) ) {
                        let label = this.$route.params.label;

                        if ( label === this.label && this.issues.length ) return;

                        this.issues = [];
                        this.label = label;
                        this.page = 1;
                        this.getIssues();
                    }
                }
            }
        },
        methods: {
            getIssues () {
                let params = {
                    creator: OWNER, 
                    page: this.page, 
                    labels: this.label
                };

                this.loading = true;

                http.get(`/repos/${OWNER}/${REPO}/issues`, params)
                    .then(issues => {
                        if ( params.labels != this.label ) return;

                        this.loading = false;

                        if ( issues && issues.length ) {
                            this.issues = this.issues.concat(issues);
                            ++ this.page;
                        } else {
                            this.pauseUpdate();
                        }
                    })
                    .catch(error => {
                        this.loading = false;
                    });
            },
            onScrolling ( e ) {
                const routeName = this.$route.name;
                const $context = this.$refs['context'];
                const scrollTop = $context.scrollTop;

                switch ( routeName ) {
                    case 'list':
                        if ( !this.isPause && routeName === 'list' && $context.scrollHeight === scrollTop + $context.clientHeight ) {
                            clearTimeout(this.timer);
                            this.timer = setTimeout(() => {
                                this.getIssues();
                            }, 200);
                        }

                        break;
                    case 'detail':
                        let $ids = $context.getElementsByClassName('nav-anchor'),
                            $hash;

                        for ( let i = 0, len = $ids.length; i < len; ++i ) {
                            let $i = $ids[i];

                            if ( !$hash || Math.abs($hash.offsetTop - scrollTop) > Math.abs($i.offsetTop - scrollTop) ) {
                                $hash = $i;
                            }
                        }
                        if ( $hash ) this.$refs['app-nav'].hash = $hash.id;
                        break;
                }
            },
            getLabels () {
                http.get(`/repos/${OWNER}/${REPO}/labels`)
                    .then(labels => {
                        this.labels = labels;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            pauseUpdate () {
                this.isPause = true;

                setTimeout(() => {
                    this.isPause = false;
                }, 20000);
            },
            setLoading ( val ) {
                this.loading = val;
            }
        },
        mounted () {
            this.getLabels();
        }
    }
</script>
