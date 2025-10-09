import { ConnectedAccount } from '../connected-account.entity';

describe('ConnectedAccount Entity', () => {
    describe('create', () => {
        it('should create connected account with default values', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');

            expect(account).toBeInstanceOf(ConnectedAccount);
            expect(account.userId).toBe('user-123');
            expect(account.stripeAccountId).toBe('acct_test_123');
            expect(account.chargesEnabled).toBe(false);
            expect(account.payoutsEnabled).toBe(false);
            expect(account.detailsSubmitted).toBe(false);
        });
    });

    describe('updateCapabilities', () => {
        it('should update account capabilities', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');

            account.updateCapabilities(true, true, true);

            expect(account.chargesEnabled).toBe(true);
            expect(account.payoutsEnabled).toBe(true);
            expect(account.detailsSubmitted).toBe(true);
        });

        it('should update partial capabilities', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');

            account.updateCapabilities(true, false, true);

            expect(account.chargesEnabled).toBe(true);
            expect(account.payoutsEnabled).toBe(false);
            expect(account.detailsSubmitted).toBe(true);
        });
    });

    describe('canAcceptPayments', () => {
        it('should return false when not fully setup', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');

            expect(account.canAcceptPayments()).toBe(false);
        });

        it('should return false when charges enabled but details not submitted', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');
            account.updateCapabilities(true, false, false);

            expect(account.canAcceptPayments()).toBe(false);
        });

        it('should return true when charges enabled and details submitted', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');
            account.updateCapabilities(true, false, true);

            expect(account.canAcceptPayments()).toBe(true);
        });
    });

    describe('canReceivePayouts', () => {
        it('should return false when not fully setup', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');

            expect(account.canReceivePayouts()).toBe(false);
        });

        it('should return false when payouts enabled but details not submitted', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');
            account.updateCapabilities(false, true, false);

            expect(account.canReceivePayouts()).toBe(false);
        });

        it('should return true when payouts enabled and details submitted', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');
            account.updateCapabilities(false, true, true);

            expect(account.canReceivePayouts()).toBe(true);
        });
    });

    describe('isFullyOnboarded', () => {
        it('should return false when not fully setup', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');

            expect(account.isFullyOnboarded()).toBe(false);
        });

        it('should return false when partially setup', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');
            account.updateCapabilities(true, false, true);

            expect(account.isFullyOnboarded()).toBe(false);
        });

        it('should return true when all capabilities enabled', () => {
            const account = ConnectedAccount.create('user-123', 'acct_test_123');
            account.updateCapabilities(true, true, true);

            expect(account.isFullyOnboarded()).toBe(true);
        });
    });
});
