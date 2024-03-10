public with sharing class RecentRecordCtrl {
    @AuraEnabled
    public static List<sObject> getRecentRecords(String objectName, Integer numRecords){
        try {
            String queryString = 'SELECT Id, Name, LastViewedDate FROM '+objectName+' WHERE LastViewedDate != NULL ORDER BY LastViewedDate desc LIMIT 15';
            return Database.query(queryString);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
