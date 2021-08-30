<template>
<div v-if="!userLogged" class="register">
    <Particles />
    <div class="welcome">
        <img id="corona-logo" alt="corona logo" src="./assets/logo/logo.png" />
        <div class="intro">With Corona spreading around the world you might be in the situation where you need to tell authorities which people you have met the last 14 days</div>
        <div class="terms" @click="showAlert">[ read terms ]</div>
        <div class="title">
            {{ title }}
        </div>

        <div class="form">
            <input autofocus autocomplete="off" type="text" placeholder="Enter your name" v-model="registerUser">
            <input autocomplete="off" type="number" placeholder="Enter your phone number" v-model="registerNumber" v-on:input="(event)=>this.$emit('inputChange', event)">

            <div class="vaccine">
                <label for="vaccine">Have you received the Covid Vaccine?</label>
                <select name="vaccine" id="vaccine" v-model="registerVaccine">
                    <option selected disabled value="">Select your answer:</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>

            <div class="acc-terms">
                <label for="acc-terms">Do you comply with the terms?
                    <input type="checkbox" id="acc-terms" name="acc-terms" v-model="registerTerms"></label>
            </div>

            <button type="button" @click="validateFields">
                <login-icon class="icon" /> Register </button>
            <div v-if="!validated" id="errors">{{ errors }}</div>
        </div>
    </div>
</div>
</template>

<script>
// the particles only for register screen
import Particles from './Particles.vue'

export default {
    name: 'Register',
    components: {
        Particles
    },
    data() {
        return {
            title: 'Register',
            registerUser: '',
            registerNumber: '',
            registerVaccine: '',
            registerTerms: false,
            userLogged: false,
            validated: Boolean,
            internetConnectivity: false,
            errors: 'Please fill all fields to register'
        }
    },
    created() {
        this.checkLocalStorage();
    },
    methods: {

        // terms link
        showAlert: function () {
            alert("terms file ...");
        },

        // checking local storrage for a registered/logged user
        checkLocalStorage() {
            if (typeof (Storage) !== "undefined") {
                if (localStorage.getItem("access")) {
                    this.userLogged = true;
                } else {
                    this.userLogged = false;
                }
            } else {
                alert('sorry your browser does not support localstorage');
            }
        },

        // network connectivity checks
        connectivityChecks() {
            if (navigator.onLine) {
                this.internetConnectivity = false
            } else {
                this.internetConnectivity = true
                this.errors = "You are not connected to internet!";
                setTimeout(() => {
                    this.internetConnectivity = false
                }, 10000);
            }
        },

        // validation of fields
        validateFields() {
            if (this.registerUser.length > 3 && this.registerNumber.length > 6 && this.registerVaccine && this.registerTerms) {
                this.connectivityChecks();
                if (!this.internetConnectivity) {
                    localStorage.setItem("access", this.registerNumber);
                    this.checkLocalStorage();
                }
            } else {
                this.errors = 'Please fill all fields to register';
                this.validated = false;
                this.connectivityChecks();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
// color variables
$lightskyblue: lightskyblue;

.register {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 10;

    .welcome {
        min-height: 200px;
        width: 100%;
        max-width: 768px;
        margin: 0 auto;
        border: 2px solid darkred;
        padding: 14px;
        background: rgba(0, 0, 0, 0.4);
        z-index: 11;
        position: relative;

        #corona-logo {
            box-shadow: 0px 0px 12px 0px rgba(50, 50, 50, 0.75);
        }

        .intro {
            padding: 10px 20px 0 20px;
            text-align: center;
        }

        .terms {
            font-weight: bold;
            text-align: center;

            &:hover {
                cursor: pointer;
                color: $lightskyblue;
            }
        }

        .title {
            padding-top: 15px;
            justify-content: center;
            font-size: 2.5rem;
            font-weight: bold;
        }

        .form {
            input[type='text'] {
                text-transform: capitalize;
            }

            .vaccine {
                display: flex;
                flex-direction: column;
                margin-bottom: 10px;

                select {
                    padding: 8px 6px;
                }
            }

            .acc-terms {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 20px 0 40px 0;

                label {
                    display: flex;
                    align-items: center;
                    font-weight: 400;
                    position: relative;

                    &:hover {
                        cursor: pointer;
                        color: $lightskyblue;

                        input[type='checkbox']::after {
                            font-family: 'Baloo Paaji 2', cursive;
                            font-size: 16px;
                            position: absolute;
                            top: 0;
                            right: -20%;
                            color: $lightskyblue;
                            text-transform: lowercase;
                            content: 'yes I do';
                        }
                    }
                }

                input[type='checkbox'] {
                    outline: none;
                    margin: 0 0 0 40px;
                    width: 40px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
