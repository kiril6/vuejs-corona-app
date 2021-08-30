<template>
<div>
    <Register v-if="!$isRegistered.registered && getStorage()===null" v-on:inputChange="handleChange" />
    <Home v-if="value || getStorage()" />
</div>
</template>

<script>
import Register from './Register.vue'
import Home from './Home.vue'

export default {

    name: 'App',
    components: {
        Register,
        Home
    },
    data() {
        return {
            kiko: false,
            value: ''
        }
    },
    beforeCreate() {
        this.$store.dispatch('setItems');
    },
    created() {
        this.getStorage();
        this.dataToBeWatched = this.$isRegistered.registered;
    },

    methods: {
        getStorage() {
            return localStorage.getItem("access");
        },

        handleChange(event) {
            const {
                value
            } = event.target;
            if (value) {
                this.value = value;
            }
        }
    }
}
</script>

<style lang="scss">
// color variables
$white: white;
$green: darkolivegreen;

* {
    box-sizing: border-box;
    outline: none;
    font-family: 'Baloo Paaji 2', cursive;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

body {
    background: url('./assets/images/bck.png');
    background-repeat: repeat;
    color: $white;
    height: 100%;
    overflow-x: hidden;
}

#corona-logo {
    width: 130px;
    display: flex;
    margin: 0 auto 20px auto;
    padding: 4px;
    border-radius: 15%;
    transition: all 1s ease-in-out;

    &:hover {
        transform: scale(1.1);
    }
}

.title {
    font-size: 16px;
    font-weight: 700;
    padding: 0 0 4px 0;
    margin: 0 0 10px 0;
    border-bottom: 2px solid #666;
    display: flex;

    .icon {
        padding-right: 4px;
    }
}

.time-of-day {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    select {
        padding: 8px 6px;
    }
}

select {
    cursor: pointer;
}

input,
button {
    border: 0;
    width: 100%;
    margin: 0 0 10px;
}

input,
select {
    font-size: 14px;
    outline: solid 1px green;
    padding: 8px 10px;
    font-weight: 600;

    &:focus {
        outline: 1.5px solid darkgreen;
    }
}

button {
    font-size: 14px;
    font-weight: bold;
    text-transform: capitalize;
    color: $white;
    background: $green;
    border: 0;
    cursor: pointer;
    height: 34px;
    transition: font 0.2s ease;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        font-size: 15px;
        font-weight: bolder;
    }

    .icon {
        padding-right: 4px;
    }
}

@keyframes pop {
    50% {
        transform: scale(1.2);
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.offline,
.about {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    background-color: rgba(255, 255, 255, 0.4);
    z-index: 10;

    &.active {
        animation: fadeOut ease 5s;
        animation-delay: 5s;
    }

    >div {
        height: 200px;
        width: 200px;
        background: $white;
        border-radius: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border: 4px solid rgba(0, 0, 0, 0.4);
        box-shadow: 0px 0px 12px 0px rgba(50, 50, 50, 0.75);

        img {
            width: 160px;
            height: auto;
        }

        >div {
            padding: 20px 18px 0 18px;
            text-align: center;
        }
    }
}

#errors {
    background: #c52323;
    color: $white;
    padding: 4px 10px;
    font-weight: bold;
    text-align: center;
}
</style>
