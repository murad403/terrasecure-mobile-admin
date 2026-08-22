import SurveyPage from '@/components/app/survey/SurveyPage'
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout'

const page = () => {
    return (
        <DashboardChildrenLayout
            title="Survey & Mapping"
            subtitle="Manage land survey and mapping cases"
        >
            <SurveyPage />
        </DashboardChildrenLayout>
    )
}

export default page
