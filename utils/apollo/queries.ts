import gql from 'graphql-tag';

// Get the list of members for the "contributors" on the front page
export const MEMBERS = gql`
  query members($os: String) {
    members(where: { os: $os }) {
      id
      address
      alias
    }
  }
`;

// Get the members who got endorsements. May have to combine this with ENDORSEMENTS_FROM_MEMBER
// to meet the UI requirements
export const ENDORSEMENTS = gql`
  query endorsements($os: String) {
    members(where: { os: $os }) {
      address
      alias
      endorsementsReceived
    }
  }
`;

// Get the people who the user gave endorsements to
export const ENDORSEMENTS_FROM_MEMBER = gql`
  query endorsementsFromMember($os: String, $from: String) {
    endorsements(
      where: {
        os: $os
        # $member: osAddress-memberAddress
        from: $from
      }
    ) {
      id
      amount
      to {
        id
        address
        alias
      }
    }
  }
`;

// Allocation points the user gave to other members
// May have to combine with PEER_REWARDS_REGISTERED_MEMBERS for to meet UI requirements
export const ALLOCATIONS_FROM_MEMBER = gql`
  query allocationsFromMember($os: String, $epochNumber: Int, $from: String) {
    allocations(where: { os: $os, from: $from, epochNumber: $epochNumber }) {
      id
      points
      to {
        address
        alias
      }
    }
  }
`;

// Members who are registered for the event
export const PEER_REWARDS_REGISTERED_MEMBERS = gql`
  query peerRewardsRegisteredMembers($os: String, $epochNumber: Int) {
    rewardsRegistrations(where: { os: $os, epochNumber: $epochNumber }) {
      id
      member {
        address
        alias
      }
    }
  }
`;

// Rewards user received from other members (not points)
// List of rewards that was given to the users. Can be aggregated to get the total rewards claimable
export const PEER_REWARDS_FOR_EPOCH = gql`
  query peerRewardsClaimable($os: String, $to: String, $epochNumber: Int) {
    allocations(
      where: {
        os: $os
        # $member: osAddress-memberAddress
        to: $to
        epochNumber: $epochNumber
      }
    ) {
      id
      epochNumber
      rewards
      from {
        address
        alias
      }
    }
  }
`;

export const UNCLAIMED_PEER_REWARDS = gql`
  query peerRewardsClaimable($os: String, $to: String, $epochNumber: Int) {
    allocations(
      where: {
        os: $os
        # $member: osAddress-memberAddress
        to: $to
        epochNumber_gt: $epochNumber
      }
    ) {
      id
      epochNumber
      rewards
      from {
        address
        alias
      }
    }
  }
`;
