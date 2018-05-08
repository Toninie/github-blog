<template>
    <div class="content">
        <p>页面不存在，{{seconds}}秒后回到首页</p>
    </div>
</template>
<script>

export default {
    name: 'Error',
    data() {
        return {
            seconds: 5
        }
    },
    mounted() {
        let timer = setInterval(() => {
            if ( -- this.seconds ) {
                this.$router.push('/');
                clearInterval(timer);
            }
        }, 1000);
    }
}
</script>