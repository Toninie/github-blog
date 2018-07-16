<template>
    <div class="error-page">
        <div class="icon-github">页面不存在，{{seconds}}秒后回到首页</div>
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
        this.$emit('loading', false);

        let timer = setInterval(() => {
            if ( -- this.seconds < 1 ) {
                if ( !this._isDestroyed ) this.$router.push('/');
                clearInterval(timer);
            }
        }, 1000);
    }
}
</script>