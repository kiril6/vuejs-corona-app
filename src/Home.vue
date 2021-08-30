<template>
<div>
    <div class="home">
        <div class="information"><strong id="logged-user">Logged {{ getStorage() }}</strong>
            <info-circle-icon class="about-app" @click="openAbout" />
        </div>

        <img id="corona-logo" alt="corona logo" src="./assets/logo/logo.png" />
        <div class="group">
            <div class="title" :class="isActive ? 'active' : ''" @click="isActive=true">
                <file-plus-icon class="icon" /> {{ newReport }}</div>
            <div class="title" :class="!isActive ? 'active' : ''" @click="isActive=false">
                <file-report-icon class="icon" /> {{ reports }}</div>
        </div>

        <div v-if="this.aboutApp" :class="!this.aboutApp ? 'about' : 'about active'">
            <div>
                <a href="http://delovski.net/qr" target="_blank"><img src="./assets/images/qr.png" alt="about app"></a>
            </div>
        </div>

        <template v-if="isActive">
            <div class="title">{{ titleIntro }}</div>
            <input tabindex="1" autocomplete="off" type="date" v-model="enterDate">

            <div class="time-of-day">
                <label for="timeOfDay">{{ timeOfDay }}</label>
                <select tabindex="2" name="timeOfDay" id="timeOfDay" v-model="enterTimeOfDay">
                    <option selected="true" disabled="disabled">Choose:</option>
                    <option value="Morning">Morning</option>
                    <option value="Mid-day">Mid-day</option>
                    <option value="Afternoon">Afternoon</option>
                </select>
            </div>

            <input tabindex="3" type="text" autocomplete="off" placeholder="Name & Surname" v-model="enterName" />
            <input tabindex="4" @click="locateMe" v-on:keyup.space="locateMe" v-on:keyup.enter="locateMe" readonly type="text" autocomplete="off" v-model="enterLocation" :placeholder="gettingLocation ? 'Getting your location...' : 'get your location'" />

            <div v-if="errorStr">
                Sorry, but the following error
                occurred: {{errorStr}}
            </div>

            <button tabindex="5" type="button" @click="addData">
                <send-icon class="icon" /> {{ addReport }}</button>
            <div v-if="errors !== ''" id="errors">{{ errors }}</div>

            <div v-if="this.offlineMode" :class="!this.offlineMode ? 'offline' : 'offline active'">
                <div>
                    <wifi-off-icon size="52" />
                    <div>{{offlineTitle}}</div>
                </div>
            </div>

        </template>

        <div v-if="isActive" class="title">{{ latestReport }}</div>

        <div v-else class="title">{{ reported }}</div>

        <div class="items-list" v-if="this.$store.getters.getItems && this.$store.getters.getItems.length > 0">
            <template v-if="isActive">
                <div class="items-holder" v-for="(item, index) in this.$store.getters.getItems.reverse()" :key="item.id">
                    <template v-if="!item.checked && index < 3">
                        <div>{{ item.date }}</div>
                        <div>{{ item.timeOfDay }}</div>
                        <div>{{ item.title }}</div>
                        <div>{{ item.location }}</div>
                    </template>
                </div>
            </template>

            <template v-else>
                <div class="filters">
                    <input v-model="filterDate" :class="filterDate ? 'active' : '' " type="date" autocomplete="off" />
                    <input v-model="filterName" :class="filterName ? 'active' : '' " type="text" autocomplete="off" placeholder="Filter by Name" />
                    <input v-model="filterTimeOfDay" :class="filterTimeOfDay ? 'active' : '' " type="text" autocomplete="off" placeholder="Filter by timeOfDay" />
                </div>
                <div class="items-holder" v-for="item in this.$store.getters.getItems" :key="item.id">
                    <template v-if="!item.checked">
                        <div class="filters-active" v-if="item.date.includes(filterDate) && item.title.toLowerCase().includes(filterName.toLowerCase()) && item.timeOfDay.toLowerCase().includes(filterTimeOfDay.toLowerCase())">
                            <div>{{ item.date }}</div>
                            <div>{{ item.timeOfDay }}</div>
                            <div>{{ item.title }}</div>
                            <div>
                                <a :href="'http://www.google.com/maps/place/'+item.location.split(',')[0]+','+item.location.split(',')[1]" rel="external" target="_blank">
                                    {{ item.location }}
                                </a>
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</div>
</template>

<script>
import {
    db
} from '@/main'

export default {

    name: 'Home',

    beforeCreate() {
        this.$store.dispatch('setItems');
    },
    created() {
        this.getStorage();
    },
    data() {
        return {
            enterName: '',
            enterDate: '',
            enterTimeOfDay: '',
            enterLocation: '',
            errors: '',
            addReport: 'Make Report',
            delItem: 'Delete',
            titleIntro: 'Inform authorities',
            timeOfDay: 'Select time of day: ',
            newReport: 'New Report',
            reports: 'Reports',
            latestReport: 'Last three reports:',
            reported: 'All Entered Reports',
            offlineTitle: 'You are not connected to internet!',
            isActive: true,
            offlineMode: false,
            aboutApp: false,
            location: null,
            gettingLocation: false,
            errorStr: null,
            filterName: '',
            filterDate: '',
            filterTimeOfDay: ''
        }
    },

    methods: {
        openAbout() {
            this.aboutApp = true
            if (this.aboutApp === true) {
                setTimeout(() => {
                    this.aboutApp = false
                }, 10000);
                return;
            }
        },

        getStorage() {
            return localStorage.getItem("access");
        },

        // asynchronous getting the location
        async getLocation() {

            return new Promise((resolve, reject) => {

                if (!("geolocation" in navigator)) {
                    reject(new Error('Geolocation is not available.'));
                }

                navigator.geolocation.getCurrentPosition(pos => {
                    resolve(pos);
                }, err => {
                    reject(err);
                });

            });
        },
        async locateMe() {

            this.gettingLocation = true;
            try {
                this.gettingLocation = false;
                this.location = await this.getLocation();
                if (this.location) {
                    this.enterLocation = this.location.coords.latitude + ',' + this.location.coords.longitude;
                } else {
                    this.enterLocation = '';
                }
            } catch (e) {
                this.gettingLocation = false;
                this.errorStr = e.message;
            }

        },

        // the submitting data
        addData() {
            if (this.getStorage() === null) {
                location.reload();
                return;
            }
            if (navigator.onLine) {
                this.offlineMode = false
            } else {
                this.offlineMode = true
                setTimeout(() => {
                    this.offlineMode = false
                }, 10000);
            }
            this.errors = ''
            this.isActive = true
            if (this.enterName !== '' && this.enterDate !== '' && this.enterTimeOfDay !== '' && this.enterLocation !== '') {
                db.collection(this.getStorage()).add({
                    title: this.enterName,
                    date: this.enterDate,
                    timeOfDay: this.enterTimeOfDay,
                    location: this.enterLocation,
                    createdAt: Date.now(),
                    checked: false
                }).then((response) => {
                    if (response) {
                        this.enterName = '';
                        this.enterDate = '';
                        this.enterTimeOfDay = '';
                        this.enterLocation = '';
                        location.reload();
                    }
                }).catch((error) => {
                    this.errors = error
                })
            } else {
                this.offlineMode ? '' : this.errors = 'Fill all entries !'
            }
        }
    },

    watch: {
        enterName(val) {
            if (this.enterName.value !== val) {
                this.errors = ''
            }
        },
        enterDate(val) {
            if (this.enterDate.value !== val) {
                this.errors = ''
            }
        },
        enterTimeOfDay(val) {
            if (this.enterTimeOfDay.value !== val) {
                this.errors = ''
            }
        },
        enterLocation(val) {
            if (this.enterLocation.value !== val) {
                this.errors = ''
            }
        }
    }
}
</script>

<style lang="scss">
// color variables
$white: white;

.home {
    width: 100%;
    max-width: 768px;
    margin: 10px auto 0 auto;
    border: 2px solid darkred;
    padding: 14px;
    background: rgba(0, 0, 0, 0.4);

    .information {
        display: flex;
        justify-content: space-between;

        #logged-user {
            padding-bottom: 4px;
            border-bottom: 2px solid rgba($white, 0.5);
        }

        .about-app {
            cursor: pointer;
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

    .group {
        display: flex;
        justify-content: space-around;
        align-items: center;

        .title {
            border-bottom: 2px solid transparent;
            cursor: pointer;

            &.active {
                border-bottom: 2px solid #666;
                cursor: default;
            }

            &:hover {
                border-bottom: 2px solid #666;
            }
        }
    }

    .items-holder {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        border-bottom: 2px solid rgba($white, 0.1);

        &:empty {
            display: none;
        }

        .filters-active {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        a:link,
        a:active,
        a:visited {
            color: #aa7e40;

            &:hover {
                color: $white;
            }
        }

        &>div:first-of-type {
            text-indent: 6px;
            position: relative;
            cursor: pointer;
            text-transform: capitalize;
        }
    }

    .filters {
        display: flex;
        justify-content: space-between;

        input:focus {
            background-color: whitesmoke;

            &.active {
                background: rgb(231, 231, 231);
            }
        }

        .active {
            background: rgb(231, 231, 231);
        }
    }

    .items-list {
        overflow-y: auto;
        padding-bottom: 20px;
        height: 100%;
    }
}
</style>
