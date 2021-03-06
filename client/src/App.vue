<template>
  <v-app dark>
    <v-content class="now-playing-bar-padding">
      <transition name="fade">
        <v-container fluid fill-height v-if="discoveringSonos">
          <v-layout align-center justify-center>
            <LoadingView></LoadingView>
          </v-layout>
        </v-container>
      </transition>
      <transition name="fade">
        <v-container fluid fill-height v-if="hasError">
          <v-layout align-center justify-center>
            <ErrorView></ErrorView>
          </v-layout>
        </v-container>
      </transition>
      <transition name="fade">
        <div v-if="!discoveringSonos && !hasError" class="fill-height">
          <!-- eslint-disable-next-line -->
          <v-navigation-drawer fixed app clipped floating :permanent="true" :mini-variant.sync="miniNav">
            <v-list class="nav-link-list">
              <template v-for="item in items">
                <v-list-tile :key="item.text" :to="{path: item.path}">
                  <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ item.text }}
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-navigation-drawer>
          <v-container fluid fill-height>
            <v-layout>
              <router-view/>
            </v-layout>
          </v-container>
          <NowPlayingBar></NowPlayingBar>
        </div>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import NowPlayingBar from '@/components/NowPlayingBar.vue';

export default {
  components: { NowPlayingBar },
  name: 'App',
  data: () => ({
    miniNav: false,
    windowWidth: 0,
    items: [
      { icon: 'search', text: 'Search', path: '/search' },
      { icon: 'music_note', text: 'Now Playing', path: '/' },
      { icon: 'speaker_group', text: 'Rooms', path: '/rooms' },
      { icon: 'library_music', text: 'Music Library', path: '/library' },
    ],
  }),
  mounted() {
    // Update on initial load
    this.windowSizeChanged();

    this.$nextTick(() => {
      window.addEventListener('resize', this.windowSizeChanged);
    });
  },
  methods: {
    windowSizeChanged() {
      this.windowWidth = window.innerWidth;
    },
  },
  computed: {
    discoveringSonos() {
      return this.$store.state.discoveringSonos;
    },
    hasError() {
      return this.$store.state.hasError;
    },
  },
  watch: {
    windowWidth(newWidth) {
      this.miniNav = newWidth < 1264;
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.windowSizeChanged);
  },
};
</script>

<style>
.now-playing-bar-padding {
  padding-bottom: 90px!important;
}
.theme--dark.application {
  background: #141e30; /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #141e30, #243b55);
  background: linear-gradient(to top, #141e30, #243b55);
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.v-navigation-drawer .v-list {
  background: transparent;
}
.theme--dark.v-navigation-drawer {
  background-color: rgba(14,21,33,0.8);
}
.nav-link-list .v-list__tile--active:after {
    content: "";
    display: block;
    position: absolute;
    top: 4px;
    bottom: 4px;
    width: 4px;
    left: 0px;
    background-color: #3898d6;
}

/** Set a default image for album art until it loads **/
.album-art-image .v-image__image {
  z-index: unset;
}
.album-art-image .v-image__image:before {
    content: ' ';
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: contain;
    background-image: url("http://localhost:5050/img/empty-album-art.b8a07499.png");
}
</style>
