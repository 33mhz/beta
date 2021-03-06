<template>
  <div v-if="profile.content" class="card profile">
    <img
      v-if="profile.content.cover_image"
      :src="profile.content.cover_image.link"
      :width="profile.content.cover_image.width"
      :height="profile.content.cover_image.height"
      :class="{
        show: loaded,
      }"
      :style="{
        'min-height': `${headerHeight}px`,
      }"
      alt=""
      class="img-fluid card-img-top"
      loading="lazy"
      @load="loaded = true"
    />
    <div class="card-body pt-3 h-card">
      <div class="flex-column d-flex flex-sm-row align-items-sm-start">
        <div
          class="d-flex justify-content-sm-between w-100 flex-column flex-sm-row"
        >
          <div
            class="d-flex flex-column align-items-center align-items-sm-stretch flex-sm-row justify-content-center justify-content-sm-start"
          >
            <a
              v-if="!profile.verified"
              :href="`/@${profile.username}`"
              style="display: none;"
              rel="me"
              class="u-url"
            >
              {{ profile.username }}
            </a>
            <thumb
              :original="profile.content.avatar_image.link"
              :zooming-options="{
                customSize: {
                  width: profile.content.avatar_image.width,
                  height: profile.content.avatar_image.height,
                },
              }"
              no-border
            >
              <avatar
                :avatar="profile.content.avatar_image"
                :size="96"
                :max-size="96"
                :alt="profile.username"
                :title="profile.id"
                class="mr-sm-3 negative u-photo"
              />
            </thumb>
            <div class="w-100">
              <h3 :title="profile.id" class="card-title mb-1">
                <span
                  class="d-flex flex-column flex-sm-row flex-row-sm flex-wrap flex-lg-nowrap align-items-center align-items-sm-baseline"
                >
                  <span :class="{ 'p-name': !profile.name }" class="p-nickname">
                    @{{ profile.username }}
                  </span>
                  <emojify
                    v-if="profile.name"
                    :text="profile.name"
                    element="small"
                    class="ml-sm-2 d-block d-sm-inline text-muted p-name"
                  />
                  <small
                    v-if="profile.badge"
                    class="ml-sm-2 d-block d-sm-inline text-muted ml-1"
                  >
                    <font-awesome-icon icon="shield-alt" />
                  </small>
                  <small
                    v-if="profile.type !== 'human'"
                    class="ml-sm-2 d-block d-sm-inline text-muted ml-1"
                  >
                    ({{ profile.type }})
                  </small>
                  <mute-button
                    v-if="profile.you_muted"
                    :profile.sync="profile"
                    class="ml-2"
                  />
                </span>
              </h3>
              <p
                v-if="profile.verified"
                id="profile-domain"
                class="text-center text-md-left"
              >
                <a :href="profile.verified.link" class="u-url" rel="me">
                  {{ profile.verified.domain }}
                </a>
                <font-awesome-icon
                  :icon="['far', 'check-circle']"
                  class="ml-1 text-success"
                />
              </p>
            </div>
          </div>
          <div v-if="user && !me" class="text-center">
            <follow-button
              id="profile-follow-button"
              :profile.sync="profile"
              class="mb-2"
            />
            <div id="profile-relation" class="text-muted">
              <small>{{ relation }}</small>
            </div>
          </div>
        </div>
      </div>
      <p
        v-if="profile.content.text"
        class="description card-text w-100 mt-3 mt-sm-0 p-note"
      >
        <entity-text :content="profile.content" />
      </p>
    </div>
    <div
      v-if="profile.counts"
      id="profile-counts"
      class="card-body d-flex justify-content-between justify-content-md-end"
    >
      <nuxt-link
        class="card-link"
        exact-active-class="text-body"
        :tag="user ? 'a' : 'span'"
        :event="user ? 'click' : ''"
        :to="`/@${profile.username}`"
      >
        {{ profile.counts.posts }} Posts
      </nuxt-link>
      <nuxt-link
        :tag="user ? 'a' : 'span'"
        :event="user ? 'click' : ''"
        class="card-link"
        exact-active-class="text-body"
        :to="`/@${profile.username}/follows`"
      >
        {{ profile.counts.following }} Follows
      </nuxt-link>
      <nuxt-link
        :tag="user ? 'a' : 'span'"
        :event="user ? 'click' : ''"
        class="card-link"
        exact-active-class="text-body"
        :to="`/@${profile.username}/followers`"
      >
        {{ profile.counts.followers }} Followers
      </nuxt-link>
      <nuxt-link
        :tag="user ? 'a' : 'span'"
        :event="user ? 'click' : ''"
        class="card-link"
        exact-active-class="text-body"
        :to="`/@${profile.username}/starred`"
      >
        {{ profile.counts.bookmarks }} Starred
      </nuxt-link>
      <b-dropdown
        no-caret
        right
        class="card-link"
        toggle-class="p-0 border-0"
        data-test-id="profile-dropdown"
        variant="link"
      >
        <template v-slot:button-content>
          <font-awesome-icon icon="ellipsis-h" />
        </template>
        <template v-if="!me && user && !profile.you_blocked">
          <b-dropdown-item-button
            :class="{ 'disabled text-center': messagePromise }"
            data-test-id="send-message"
            @click.prevent.stop="sendMessage"
          >
            <span v-if="!messagePromise">
              Send a Message
            </span>
            <font-awesome-icon v-else icon="circle-notch" fixed-width spin />
          </b-dropdown-item-button>
          <div class="dropdown-divider" />
        </template>
        <b-dropdown-item v-if="me" to="/polls">
          Your polls
        </b-dropdown-item>
        <block-button
          v-if="user && !me"
          v-slot="{ toggleBlock }"
          :profile.sync="profile"
        >
          <b-dropdown-item-button @click.prevent="toggleBlock">
            {{ blockText }}
          </b-dropdown-item-button>
        </block-button>
        <mute-button
          v-if="user && !me && !profile.you_blocked"
          v-slot="{ toggleMute }"
          :profile.sync="profile"
        >
          <b-dropdown-item-button @click.prevent="toggleMute">
            {{ muteText }}
          </b-dropdown-item-button>
        </mute-button>
        <b-dropdown-divider />
        <b-dropdown-item
          :href="
            'https://api.pnut.io/v0/feed/rss/users/' + profile.id + '/posts'
          "
        >
          <font-awesome-icon
            icon="rss-square"
            class="mr-2"
            aria-hidden="true"
          />
          <span>RSS</span>
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <create-pm-modal />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import FollowButton from '~/components/atoms/FollowButton.vue'
import Thumb from '~/components/molecules/Thumb.vue'
import Avatar from '~/components/atoms/Avatar.vue'
import EntityText from '~/components/atoms/EntityText.vue'
import BlockButton from '~/components/atoms/BlockButton.vue'
import MuteButton from '~/components/atoms/MuteButton.vue'
import createPmModal from '~/components/organisms/CreatePmModal.vue'
import { User } from '~/entity/user'
import { Channel } from '~/entity/channel'
import { PnutResponse } from '~/entity/pnut-response'

export default Vue.extend({
  components: {
    createPmModal,
    FollowButton,
    Thumb,
    Avatar,
    EntityText,
    BlockButton,
    MuteButton,
  },
  props: {
    initialProfile: {
      required: true,
      type: Object,
    } as PropOptions<User>,
  },
  data() {
    return {
      headerHeight: 0,
      loaded: false,
      profile: this.initialProfile,
      messagePromise: null as Promise<PnutResponse<Channel>> | null,
    }
  },
  computed: {
    user(): User | null {
      return this.$accessor.user
    },
    relation(): string {
      return this.profile.follows_you ? 'Follows you' : ''
    },
    me(): boolean {
      return !!this.user && this.profile.id === this.user.id
    },
    atname(): string {
      return `@${this.profile.username}`
    },
    blockText(): string {
      const prefix = this.profile.you_blocked ? 'Unblock' : 'Block'
      return `${prefix} ${this.atname}`
    },
    muteText(): string {
      const prefix = this.profile.you_muted ? 'Unmute' : 'Mute'
      return `${prefix} ${this.atname}`
    },
  },
  watch: {
    profile: {
      handler(profile) {
        this.$emit('update:initialProfile', profile)
      },
      deep: true,
    },
    loaded(bool) {
      if (!bool) return
      this.headerHeight = 0
    },
  },
  mounted() {
    const { width } = this.$el.getBoundingClientRect()
    if (!this.profile.content) return
    // 2 === side border width
    const ratio = (width - 2) / this.profile.content.cover_image.width
    this.headerHeight = this.profile.content.cover_image.height * ratio
  },
  methods: {
    async sendMessage() {
      try {
        this.messagePromise = this.$axios.$get<PnutResponse<Channel>>(
          `/users/me/channels/existing_pm?ids=@${this.profile.username}`
        )
        const { data } = await this.messagePromise
        // found
        this.$router.push(`/channels/${data.id}`)
      } catch (e) {
        // not found and transition to /channels
        this.$modal.show('create-pm-modal', {
          isPrivate: true,
          target: this.profile.username,
        })
      }
      this.messagePromise = null
    },
  },
})
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';

.negative {
  margin-top: -48px;
  background-color: white;
}

.profile {
  @include no-gutter-xs;
}

.min-card-image-height {
  min-height: 200px;
}

.card-img-top {
  transition: all 0.5s ease;
  opacity: 0;
}
.show {
  opacity: 1;
}
.dropdown-divider {
  margin: 0;
}
</style>
