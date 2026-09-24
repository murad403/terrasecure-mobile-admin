import SiteVisitsPage from '@/components/app/site-visits/SiteVisitsPage'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'

const page = () => {
  return (
    <DashboardChildrenLayout
      title="Site Visits"
      subtitle="Manage and schedule land verification site visits"
    >
      <SiteVisitsPage />
    </DashboardChildrenLayout>
  )
}

export default page
