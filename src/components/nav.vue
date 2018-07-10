<template>
	<nav :class="{'active': isLoad}">
        <div class="label-nav">
            <p>标签</p>
            <router-link 
                v-for="item in labels"
                :to="'/label/'+item.name"
                v-bind:style="getStyle(item)"
                @click.native="toggle(item)">
                {{item.name}}
            </router-link>
        </div>
        <div v-if="paragraph && paragraph.length" class="content-nav">
            <p>文章目录</p>
            <nav-tree :data="paragraph" :hash="hash"></nav-tree>
        </div>
    </nav>
</template>

<script>
    import bus from '@/bus';
    import navTree from './navTree'

	export default {
        props: ['labels'],
		data () {
			return {
                label: '',
                timer: 0,
                paragraph: null,
                paragraphMap: {},
                hash: '',
                isLoad: false,
            }
		},
        components: {
            navTree
        },
        watch: {
            '$route.path': {
                immediate: true,
                handler(path) {
                    let hash = (window.location.hash || '').replace(/^#/, '');

                    window.location.hash = '';

                    this.hash = hash;
                    this.isLoad = false;

                    if ( !path.match(/\/detail\//) ) {
                        this.paragraph = null;

                        setTimeout(() => {
                            this.isLoad = true;
                        }, 500);
                    }

                    this.label = this.$route.params.label;
                }
            },
            hash: {
                immediate: true,                
                handler(hash) {
                    let p = this.paragraphMap[hash];

                    p && p.parent && this.expand(p.parent);
                }
            }
        },
		methods: {
            getStyle ( item ) {
                let color = '#' + item.color;

                return {
                    'backgroundColor': color,
                    'borderColor': color,
                    'color': color
                }
            },
            toggle ( item ) {
                if (this.label === this.$route.params.label) {
                    this.$router.push('/');
                }
            },
            expand ( p ) {
                if ( !p ) return;

                p.isExpand = true;
                
                this.expand(p.parent);
            }
        },
        created () {
            bus
                .$on('sendToNav', data => {
                    this.paragraph = data.nav;
                    this.paragraphMap = data.map;

                    setTimeout(() => {
                        let hash = this.hash,
                            p = this.paragraphMap[hash];

                        p && p.parent && this.expand(p.parent);

                        window.location.hash = hash;
                        this.isLoad = true;
                    }, 0);
                })
                .$on('updateHash', hash => {
                    this.hash = hash;
                });


        }
	}
</script>