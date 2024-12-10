'use client'

import useTranslate from "@/hooks/use-translate";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function TrendingCard() {
    const { t } = useTranslate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{t('whoToFollow')}</CardTitle>
      </CardHeader>
      <CardContent>
  
      </CardContent>
    </Card>
  )
}
