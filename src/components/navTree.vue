<template>
    <div class="nav-tree">
        <div 
            class="nav-tree-item" 
            v-for="p in data"
            :class="{'active': hash === p.id}">
            <a 
                :href="'#' + p.id" 
                v-html="p.label" 
                @click="select(p)">
            </a>
            <nav-tree 
                v-if="p.children && p.children.length"
                :class="{'expand': p.isExpand}" 
                :data="p.children"
                :hash="hash">
            </nav-tree>
            <i class="icon-circle-down" @click="p.isExpand = !p.isExpand"></i>
        </div>
    </div>
</template>

<script>
import bus from '@/bus';

export default {
    name: 'navTree',
    props: ['data', 'hash'],
    data () {
        return {
            isExpand: false
        }
    },
    methods: {
        select ( p ) {
            bus.$emit('updateHash', p.id);
            if ( p.children ) p.isExpand = true;
        }
    }
}
</script>

