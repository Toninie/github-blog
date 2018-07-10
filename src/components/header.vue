<template>
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
            <router-link :to="'/'">{{title}}</router-link>
        </div>
    </header>
</template>

<script>
    import { http } from '@/gitment/utils';
    import { OWNER, REPO, TITLE } from '@/config';

    export default {
        data () {
            return {
                title: TITLE,
                user: {},
                labels: null
            }
        },
        methods: {
            getUser() {
                http.get(`/users/${OWNER}`)
                    .then(user => {
                        if ( user ) {
                            this.user = user;
                        }
                    });
            }
        },
        mounted () {
            this.getUser();
        }
    }
</script>