<template>
  <div v-if="user.content">
    <div class="media justify-content-start align-items-center">
      <avatar :avatar="user.content.avatar_image" size="64" />
      <div class="ml-auto text-center">
        <div class="mb-1">
          <follow-button :profile="user" @update:profile="update" />
        </div>
        <div>
          <relation-badge :user="user" />
        </div>
      </div>
    </div>
    <h6 class="mt-1">
      <nuxt-link :to="`/@${user.username}`">
        {{ user.username }}
      </nuxt-link>
      <small>{{ user.name }}</small>
    </h6>
    <p v-if="user.content">
      <entity-text :content="user.content" />
    </p>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { User } from '~/entity/user'
import Avatar from '~/components/atoms/Avatar.vue'
import EntityText from '~/components/atoms/EntityText.vue'
import FollowButton from '~/components/atoms/FollowButton.vue'
import RelationBadge from '~/components/atoms/RelationBadge.vue'

@Component({
  components: { Avatar, EntityText, FollowButton, RelationBadge },
})
export default class UserPopperInner extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  user!: User

  update(newUser: User) {
    this.$emit('update:user', newUser)
  }
}
</script>
<style scoped>
.media-body p {
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: anywhere;
}
</style>
