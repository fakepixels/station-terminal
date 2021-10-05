import gql from 'graphql-tag';

// Get the list of members for the "contributors" on the front page
export const MEMBERS = gql`
  query members($os: String) {
    members(where: { os: $os }) {
      id
      alias
    }
  }
`;

// Get the members who got endorsements. May have to combine this with ENDORSEMENTS_FROM_MEMBER
// to meet the UI requirements
export const ENDORSEMENTS = gql`
  query endorsements($os: String) {
    members(where: { os: $os }) {
      id
      alias
      endorsementsReceived
    }
  }
`;

// Get the people who the user gave endorsements to
export const ENDORSEMENTS_FROM_MEMBER = gql`
  query endorsementsFromMember($os: String, $member: String) {
    endorsements(
      where: {
        os: $os
        # $member: osAddress-memberAddress
        from: $member
      }
    ) {
      id
      amount
      to {
        id
        alias
      }
    }
  }
`;

// Allocation points the user gave to other members
// May have to combine with PEER_REWARDS_REGISTERED_MEMBERS for to meet UI requirements
export const ALLOCATIONS_FROM_MEMBER = gql`
  query allocationsFromMember(
    $os: String
    $epochNumber: Number
    $member: String
  ) {
    allocations(
      where: {
        os: $os
        # $member: osAddress-memberAddress
        from: $member
        epochNumber: $epochNumber
      }
    ) {
      id
      points
      to {
        id
        alias
      }
    }
  }
`;

// Members who are registered for the event
export const PEER_REWARDS_REGISTERED_MEMBERS = gql`
  query peerRewardsRegisteredMembers($os: String, $epochNumber: Number) {
    rewardsRegistrations(where: { os: $os, epochNumber: $epochNumber }) {
      id
      member {
        id
        alias
      }
    }
  }
`;

// Rewards user received from other members (not points)
// List of rewards that was given to the users. Can be aggregated to get the total rewards claimable
export const PEER_REWARDS_CLAIMABLE = gql`
  query peerRewardsClaimable(
    $os: String
    $member: String
    $epochNumber: Number
  ) {
    allocations(
      where: {
        os: $os
        # $member: osAddress-memberAddress
        to: $member
        epochNumber: $epochNumber
      }
    ) {
      id
      epochNumber
      rewards
      from {
        id
        alias
      }
    }
  }
`;
