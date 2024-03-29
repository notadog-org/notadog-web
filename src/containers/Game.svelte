<script>
  import { _ } from "svelte-i18n";
  import { onMount, onDestroy } from "svelte";
  import { navigate } from "svelte-routing";
  import { room, player, stepCode } from "../store/game";
  import { GameHub } from "../hubs/game";
  import { GAME_STATES } from "../constants/game";
  import GameWaitingPlayersState from "./GameWaitingPlayersState.svelte";
  import GameWaitingStartState from "./GameWaitingStartState.svelte";
  import GamePlayingState from "./GamePlayingState.svelte";
  import GameEndState from "./GameEndState.svelte";
  import UserCard from "../components/UserCard.svelte";
  import PlayProgress from "../components/PlayProgress.svelte";
  import RefreshButton from "../components/RefreshButton.svelte";

  onMount(() => {
    GameHub.connect();
  });

  onDestroy(() => {
    GameHub.disconnect();
    room.reset();
  });

  function joinGameHandler() {
    navigate("/game/join", { replace: true });
  }

  function createGameHandler() {
    navigate("/game/create", { replace: true });
  }

  function refreshHandler() {
    GameHub.refresh();
  }

  function leaveGameHandler() {
    GameHub.leaveRoom();
  }
</script>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-card {
    margin-bottom: 15px;
  }
</style>

<div class="container noselect">
  <div class="header">
    <h1>{$_('common.game')}</h1>
    <RefreshButton on:click={refreshHandler} />
  </div>

  {#if $room === undefined}
    <div class="game-status flex-cc">{$_('common.connecting')}</div>
  {:else if $room === null}
    <div class="user-card">
      <UserCard user={$player} />
    </div>
    <div class="game-status flex-cc">{$_('common.connected')}</div>
    <button class="btn btn--basic" on:click={joinGameHandler}>
      {$_('game.joinPublicRoom')}
    </button>
    <button class="btn btn--basic" on:click={createGameHandler}>
      {$_('game.createRoom')}
    </button>
  {:else}
    {#if $stepCode === GAME_STATES.WAITING_PLAYERS}
      <GameWaitingPlayersState>
        <span slot="leaveButton">
          <button class="btn btn--basic" on:click={leaveGameHandler}>
            {$_('game.leaveRoom')}
          </button>
        </span>
      </GameWaitingPlayersState>
    {/if}

    {#if $stepCode === GAME_STATES.WAITING_START}
      <GameWaitingStartState>
        <span slot="playProgress">
          <PlayProgress
            common={$room.players.length}
            marked={$room.makedMovePlayerIds.length} />
        </span>
        <span slot="leaveButton">
          <button class="btn btn--basic" on:click={leaveGameHandler}>
            {$_('game.leaveRoom')}
          </button>
        </span>
      </GameWaitingStartState>
    {/if}

    {#if $stepCode === GAME_STATES.PLAYING_STATE}
      <GamePlayingState>
        <span slot="playProgress">
          <PlayProgress
            common={$room.players.length}
            marked={$room.makedMovePlayerIds.length} />
        </span>
        <span slot="leaveButton">
          <button class="btn btn--basic" on:click={leaveGameHandler}>
            {$_('game.leaveRoom')}
          </button>
        </span>
      </GamePlayingState>
    {/if}

    {#if $stepCode === GAME_STATES.END_STATE}
      <GameEndState>
        <span slot="leaveButton">
          <button class="btn btn--basic" on:click={leaveGameHandler}>
            {$_('game.leaveRoom')}
          </button>
        </span>
      </GameEndState>
    {/if}
  {/if}
</div>
