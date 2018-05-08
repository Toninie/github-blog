<template>
    <div id="app">
        <header class="main">
            <div class="main-info">
                <a :href="user.html_url" target="_blank">
                    <div class="main-avatar">
                        <img :src="user.avatar_url" />
                    </div>
                    <font>{{user.name || user.login}}</font>
                </a>
            </div>
            <div class="main-title">
                <router-link :to="'/'">
                    {{title}}</router-link>
            </div>
        </header>
        <section ref="context" class="context" @scroll="onScrolling">
            <router-view ref="context-view" v-on:getMoreIssues="getIssues" :issues="issues" @loading="setLoading">
            </router-view>
            <div v-show="loading" class="loading-tips">
                <svg height="60" viewBox="0 0 16 16" version="1.1" width="60" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                <p>loading</p>
            </div>
        </section>
        <footer class="main">
            <p>Powered By <a href="http://github.com">Github</a></p>
        </footer>
    </div>
</template>
<script>
    import 'normalize.css';
    import './style/main.css';
    import { http } from './gitment/utils';
    import { OWNER, REPO, TITLE } from './config';

    export default {
        name: 'app',
        data: function() {
            return {
                title: TITLE,
                page: 1,
                issues: [],
                user: {},
                timer: 0,
                loading: false,
                isPause: false,
            }
        },
        methods: {
            getIssues() {
                const isShowList = this.$route.path === '/';

                if (isShowList) this.loading = true;

                http.get(`/repos/${OWNER}/${REPO}/issues`, {creator: OWNER, page: this.page})
                    .then(issues => {
                        if (isShowList) this.loading = false;

                        if ( issues && issues.length ) {
                            this.issues = this.issues.concat(issues);
                            ++ this.page;
                        } else {
                            this.pauseUpdate();
                        }
                    })
                    .catch(error => {
                        if (isShowList) this.loading = false;
                    });
            },
            getUser() {
                http.get(`/users/${OWNER}`)
                    .then(user => {
                        if ( user ) {
                            this.user = user;
                        }
                    });
            },
            onScrolling(e) {
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
                        let $ids = $context.getElementsByTagName('h2'),
                            $hash;

                        for ( let i = 0, len = $ids.length; i < len; ++i ) {
                            let $i = $ids[i];

                            if ( !$hash || Math.abs($hash.offsetTop - scrollTop) > Math.abs($i.offsetTop - scrollTop) ) {
                                $hash = $i;
                            }
                        }
                        if ( $hash ) this.$refs['context-view'].hash = $hash.id;
                        break;
                }

                
            },
            pauseUpdate() {
                this.isPause = true;

                setTimeout(() => {
                    this.isPause = false;
                }, 20000);
            },
            setLoading(val) {
                this.loading = val;
            }
        },
        mounted() {
            this.getUser();
            this.getIssues();
        }
    }
</script>
