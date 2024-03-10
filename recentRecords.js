import { LightningElement, api} from 'lwc';
import wordCloudJS from '@salesforce/resourceUrl/wordCloudJS';
import{ loadScript } from 'lightning/platformResourceLoader';
import getRecentRecords from '@salesforce/apex/RecentRecordCtrl.getRecentRecords';
import { NavigationMixin } from 'lightning/navigation';

export default class RecentRecords extends NavigationMixin(LightningElement) {
    @api objectName;
    @api numRecords;

    rendered = false;

    get cardName(){
        return `Recently accessed ${this.objectName}s`;
    }

    renderedCallback(){
        if(this.rendered)
            return;

        this.rendered = true;
        loadScript(this, wordCloudJS).then(() => {
            getRecentRecords({objectName: this.objectName, numRecords: this.numRecords})
                .then(result => {
                    let wordSize = 15;
                    var list = [];
                    result.forEach(record => {
                        let arr = [];
                        arr.push(record.Name);
                        arr.push(wordSize);
                        arr.push(record.Id);
                        wordSize--;
                        list.push(arr);
                        console.log('list:', list);
                    });
                    console.log('list:', list);
                    WordCloud(this.template.querySelector(".wc"), {list: list, click: (item)=>{
                        const recordId = item[2];
                        this[NavigationMixin.Navigate]({
                            type: 'standard__recordPage',
                            attributes: {
                                actionName: "view",
                                recordId: recordId,
                                objectApiName: this.objectName
                            }
                        });
                    }});
                })
                .catch(error => {

                });
            //let list = [['foo', 12], ['bar', 6]];
            //console.log('list:', list);   
        });
    }
}