<template>
    <div class="issue-list">
        <div class="issue-item" v-for="item in issues">
            <div class="issue-text">
                <router-link :to="'/detail/'+item.number">{{item.title}}</router-link>
                <p v-html="summary(item.body_html)"></p>
            </div>
        </div>
    </div>
</template>

<script>
import { TITLE } from '@/config';

export default {
    name: 'List',
    props: ['issues'],
    data () {
        return {
        }
    },
    methods: {
        summary ( html ) {
            return html
                .replace(/<pre[\s\S]*>[\s\S]*<\/pre>/g, "[code]code[/code]")
                .replace(/<h[1-7][\s\S]*?>[\s\S]*?<\/h[1-7]>/g, "")
                .replace(/<(\/{0,1})code>/g, `[$1code]`)
                .replace(/<[^>]+>/g, " ")
                .replace(/\[(\/{0,1})code\]/g, `<$1code>`)
                .replace(/\n/g, "");
        }
    },
    mounted () {
        window.document.title = TITLE;
    }
}
</script>
