interface Member {
    id: string;
    name: string;
    contributionBalance: number;
    loanBalance: number;
}

interface Transaction {
    memberId: string;
    amount: number;
    type: 'CONTRIBUTION' | 'LOAN_DISBURSEMENT' | 'LOAN_REPAYMENT';
    date: Date;
}

class ChamaManager {
    private members: Map<string, Member> = new Map();
    private transactions: Transaction[] = [];
    private totalGroupSavings: number = 0;

    public registerMember(id: string, name: string): void {
        if (this.members.has(id)) throw new Error('Member already exists');
        this.members.set(id, { id, name, contributionBalance: 0, loanBalance: 0 });
        console.log(`Member registered: ${name}`);
    }

    public contribute(memberId: string, amount: number): void {
        const member = this.members.get(memberId);
        if (!member) throw new Error('Member not found');
        
        member.contributionBalance += amount;
        this.totalGroupSavings += amount;
        this.transactions.push({
            memberId, amount, type: 'CONTRIBUTION', date: new Date()
        });
        console.log(`${member.name} contributed KES ${amount}. Total Savings: ${this.totalGroupSavings}`);
    }

    public applyForLoan(memberId: string, amount: number): boolean {
        const member = this.members.get(memberId);
        if (!member) throw new Error('Member not found');

        const loanLimit = member.contributionBalance * 3;
        if (amount > loanLimit) {
            console.log(`Loan denied: ${member.name} exceeds limit of KES ${loanLimit}`);
            return false;
        }

        if (amount > this.totalGroupSavings) {
            console.log(`Loan denied: Insufficient group funds`);
            return false;
        }

        member.loanBalance += amount * 1.10; // 10% interest rate
        this.totalGroupSavings -= amount;
        this.transactions.push({
            memberId, amount, type: 'LOAN_DISBURSEMENT', date: new Date()
        });
        console.log(`Loan approved for ${member.name}: KES ${amount}. To repay: KES ${member.loanBalance.toFixed(2)}`);
        return true;
    }

    public repayLoan(memberId: string, amount: number): void {
        const member = this.members.get(memberId);
        if (!member) throw new Error('Member not found');
        
        member.loanBalance -= amount;
        this.totalGroupSavings += amount;
        this.transactions.push({
            memberId, amount, type: 'LOAN_REPAYMENT', date: new Date()
        });
        console.log(`${member.name} repaid KES ${amount}. Remaining Debt: KES ${member.loanBalance.toFixed(2)}`);
    }

    public generateReport(): void {
        console.log('\n--- Chama Financial Report 2026 ---');
        console.log(`Total Group Kitty: KES ${this.totalGroupSavings.toFixed(2)}`);
        this.members.forEach(m => {
            console.log(`Member: ${m.name} | Savings: ${m.contributionBalance} | Debt: ${m.loanBalance.toFixed(2)}`);
        });
        console.log('------------------------------------\n');
    }
}

// Simulation Run
const chama = new ChamaManager();
try {
    chama.registerMember('M001', 'Alice Wambui');
    chama.registerMember('M002', 'John Omari');
    
    chama.contribute('M001', 5000);
    chama.contribute('M002', 10000);
    chama.contribute('M001', 2000);

    chama.applyForLoan('M001', 15000);
    chama.applyForLoan('M002', 5000);

    chama.repayLoan('M002', 2000);
    
    chama.generateReport();
} catch (error: any) {
    console.error(`System Error: ${error.message}`);
}