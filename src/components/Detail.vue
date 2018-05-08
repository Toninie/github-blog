<template>
    <section v-show="!loading">
        <div class="content">
            <ul>
                <a v-for="p in detail.paragraph" :href="'#' + p.id" :class="{'active': hash === p.id}" @click="hash = p.id">
                    <li v-html="p.label"></li>
                </a>
            </ul>
            <article class="gitment-comment-body gitment-markdown">
                <h1>{{detail.title}}</h1>
                <div v-html="detail.html"></div>
            </article>
        </div>
        <div id="comments"></div>
    </section>
</template>
<script>
    import {
        OWNER,REPO,OAUTH,TITLE
    } from '../config'

    import '../gitment/default.css'
    import Gitment from '../gitment/gitment.js'

    export default {
        name: 'Detail',
        data() {
            let hash = (window.location.hash || '').replace(/^#/, '');

            window.location.hash = '';

            return {
                detail: {},
                hash: hash,
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
                oauth: OAUTH
            });

            gitment.render(document.getElementById('comments'));

            gitment
                .getIssue()
                .then((issue) => {
                    this.getDetail(issue);
                    this.loading = false;
                })
                .catch(() => {
                    this.$router.push('error');
                });
        },
        methods: {
            getDetail ( issue ) {
                const paragraph = [];

                let html = issue.body_html || '';

                this.detail.title = document.title = issue.title;

                this.detail.html = html.replace(/(\<h2\>)(.+)(?=\<\/h2\>)/ig, (str, key) => {
                    let t = {
                        id: 'content_title_' + paragraph.length,
                        label: str.replace(/\<h\d\>/, '')
                    };

                    paragraph.push(t);

                    return str.replace(/(\<h\d)/, `$1 id=${t.id}`);
                });

                this.detail.paragraph = paragraph;

                setTimeout(() => {
                    window.location.hash = this.hash;
                }, 0);
            }
        }
    }
</script>

<style scoped>
ul {
    position: fixed;
    top: 60px;
    left: 20px;
    max-width: calc(15% + 10px);
    height: calc(100% - 90px);
    padding: 0;
    list-style: none;
    overflow: auto;
}

ul a {
    text-decoration: none;
    color: #000;
}

ul li {
    padding-left: 10px;
    border-left: 2px solid #eee;
    line-height: 25px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

ul a.active li {
    border-color: #24292e;
}

article,
#comments {
    margin: 0 0 0 15%;
    padding: 25px 50px;
    background-color: #fff;
}
</style>