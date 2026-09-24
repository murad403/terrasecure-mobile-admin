import PaymentsPage from '@/components/app/payments/PaymentsPage'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'

const page = () => {
  return (
    <DashboardChildrenLayout
      title="Payments"
      subtitle="Manage and track transaction fees and payment methods"
    >
      <PaymentsPage />
    </DashboardChildrenLayout>
  )
}

export default page
