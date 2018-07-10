<template>
    <section v-show="!loading">
        <div class="content">
            <article class="gitment-comment-body gitment-markdown">
                <h1 id="title" class="nav-anchor">{{detail.title}}</h1>
                <div v-html="detail.html"></div>
            </article>
        </div>
        <div id="comments" class="nav-anchor"></div>
    </section>
</template>
<script>
    import {
        OWNER,REPO,OAUTH,TITLE
    } from '@/config'

    import '@/gitment/default.css'
    import Gitment from '@/gitment/gitment.js'
    import bus from '@/bus'

    export default {
        name: 'Detail',
        data() {
            return {
                detail: {},
                loading: false,
            }
        },
        watch: {
            loading: {
                immediate: true,
                handler( val ) {
                    this.$emit('loading', val);
                }
            }
        },
        mounted() {
            document.title = TITLE + " -- loading";

            this.loading = true;

            const gitment = new Gitment({
                id: this.$route.params.id,
                owner: OWNER,
                repo: REPO,
                oauth: {
                    client_id: OAUTH[0],
                    client_secret: OAUTH[1]
                }
            });

            gitment.render(document.getElementById('comments'));

            gitment
                .getIssue()
                .then((issue) => {
                    this.getDetail(issue);
                    this.loading = false;
                })
                .catch(error => {
                    this.$router.push('/error');
                });
        },
        methods: {
            getDetail ( issue ) {
                let paragraph = [],
                    title = issue.title,
                    p = {
                        id: 'title',
                        children: paragraph,
                        label: '正文',
                        level: 1,
                        isExpand: true
                    },
                    c = {
                        id: 'comments',
                        label: '评论'
                    },
                    nav = [p, c],
                    map = {'title': p, 'comments': c},
                    count = 0,
                    html = issue.body_html || '';

                this.detail.title = document.title = title;

                this.detail.html = html.replace(/(\<h\d+\>)(.+)(?=\<\/h\d+\>)/ig, (str, key) => {
                    let t = {
                        id: 'content_title_' + (count ++),
                        label: str.replace(/\<h\d\>/, ''),
                        level: str.match(/\d+(?=\>)/)[0],
                        isExpand: false
                    };

                    map[t.id] = t;

                    addParagraph(t);

                    return str.replace(/(\<h\d)/, `$1 id=${t.id} class="nav-anchor"`);
                });

                bus.$emit('sendToNav', {nav, map});

                function addParagraph( t ) {
                    let l = t.level - p.level;

                    if ( l === 1 ) {
                        t.parent = p;
                        !p.children && (p.children = []);
                        p.children.push(t);
                        return;
                    } else if ( l > 1 ) {
                        let children = p.children;

                        p = children[children.length - 1];
                    } else {
                        p = p.parent;
                    }

                    addParagraph(t);
                }
            }
        }
    }
</script>

<style scoped>



</style>