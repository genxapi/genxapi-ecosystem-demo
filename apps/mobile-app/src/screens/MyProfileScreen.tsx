import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCustomerMobileApi } from '../api/sdk';
import { useAuthSession } from '../auth/AuthSessionContext';
import { cardShadow, theme } from '../theme';
import { formatDateTime, formatLabel, getErrorMessage } from '../utils/format';

export default function MyProfileScreen() {
  const api = useCustomerMobileApi();
  const { user } = useAuthSession();
  const profileQuery = useQuery({
    queryKey: ['me', user?.id ?? 'anonymous'],
    queryFn: ({ signal }) => api.getMyProfile(signal),
    enabled: Boolean(user),
  });

  return (
    <View style={styles.screen}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>My Profile</Text>
        <Text style={styles.title}>
          {profileQuery.data ? `Welcome back, ${profileQuery.data.firstName}.` : 'Your account at a glance'}
        </Text>
        <Text style={styles.description}>
          This screen reads the authenticated customer record from /me through the generated users
          SDK package. There is no cross-user navigation in the mobile app.
        </Text>
      </View>

      {profileQuery.isLoading ? (
        <View style={styles.card}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.stateText}>Loading your profile...</Text>
        </View>
      ) : null}

      {profileQuery.isError ? (
        <View style={styles.card}>
          <Text style={styles.errorText}>Error: {getErrorMessage(profileQuery.error)}</Text>
          <Pressable onPress={() => void profileQuery.refetch()} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!profileQuery.isLoading && !profileQuery.isError && profileQuery.data ? (
        <>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Account details</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{formatLabel(profileQuery.data.role)}</Text>
              </View>
            </View>

            <View style={styles.detailList}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full name</Text>
                <Text style={styles.detailValue}>
                  {profileQuery.data.firstName} {profileQuery.data.lastName}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{profileQuery.data.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <View
                  style={[
                    styles.badge,
                    profileQuery.data.isActive ? styles.successBadge : styles.inactiveBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      profileQuery.data.isActive ? styles.successBadgeText : styles.inactiveBadgeText,
                    ]}
                  >
                    {profileQuery.data.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Member since</Text>
                <Text style={styles.detailValue}>{formatDateTime(profileQuery.data.createdAt)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer id</Text>
                <Text style={styles.detailValue}>User {profileQuery.data.id}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Session scope</Text>
            <View style={styles.summaryStack}>
              <View style={styles.summaryBlock}>
                <Text style={styles.summaryLabel}>Authenticated claims</Text>
                <Text style={styles.summaryValue}>{user?.name ?? profileQuery.data.firstName}</Text>
                <Text style={styles.summaryDescription}>
                  Demo session claims decide whether the customer screens are visible.
                </Text>
              </View>
              <View style={styles.summaryBlock}>
                <Text style={styles.summaryLabel}>Visible screens</Text>
                <Text style={styles.summaryValue}>My Profile and My Payments</Text>
                <Text style={styles.summaryDescription}>
                  Internal browsing flows are intentionally absent from this mobile customer app.
                </Text>
              </View>
              <View style={styles.summaryBlock}>
                <Text style={styles.summaryLabel}>Runtime adoption</Text>
                <Text style={styles.summaryValue}>SDK package + app session</Text>
                <Text style={styles.summaryDescription}>
                  Base URLs and bearer token injection stay at the app boundary instead of inside the
                  screen.
                </Text>
              </View>
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 16,
  },
  heroCard: {
    backgroundColor: theme.colors.surfaceSoft,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.spacing.lg,
    ...cardShadow,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.navy,
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: 14,
    padding: theme.spacing.lg,
    ...cardShadow,
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 15,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceSoft,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: theme.colors.navy,
    fontSize: 14,
    fontWeight: '700',
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: theme.colors.navy,
    fontSize: 20,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  successBadge: {
    backgroundColor: theme.colors.successSurface,
  },
  successBadgeText: {
    color: theme.colors.success,
  },
  inactiveBadge: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  inactiveBadgeText: {
    color: theme.colors.muted,
  },
  detailList: {
    gap: 16,
  },
  detailRow: {
    gap: 8,
  },
  detailLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: theme.colors.navy,
    fontSize: 16,
    lineHeight: 22,
  },
  summaryStack: {
    gap: 14,
    marginTop: 14,
  },
  summaryBlock: {
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 20,
    padding: 16,
  },
  summaryLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: theme.colors.navy,
    fontSize: 17,
    fontWeight: '700',
  },
  summaryDescription: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
});
