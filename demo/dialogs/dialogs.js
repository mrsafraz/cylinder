import {Dialog} from 'framework';
import {Toast} from 'framework';

class DialogsModule {
	showBasicDialog(){
		Dialog.showInstance('cylinder/demo/dialogs/my-greeting', {name: 'Cylinder'}, {
			autoclose: true,
			size: 'large',
		});
	}
	showPopover($event){
		Dialog.showInstance('cylinder/demo/dialogs/my-greeting', {name: 'Cylinder'}, {
			popover: $event.target,
			autoclose: true,
		});
	}
	showBasicMessage(){
		Dialog.showMessage('This is a message', 'This is the title');
	}
	showConfirmMessage(){
		Dialog.showConfirm('This is a confirmation message', 'This is the title', ['Yes', 'No']).then((ok) => {
			if(ok){
				// Yes
			}
		});
	}
	showActionSheet($event){
		Dialog.showActionSheet(['Comment', 'Reply', 'Delete', 'Cancel'], 'Actions Title', {
			popover: $event.target,
			autoclose: true,
		}).then((action)=> {
			if(action == 'Reply'){
				alert('Replying...');
			}
			if(action == 'Comment'){
				alert('Commenting...');
			}
		});
	}
	showToast(){
		Toast.show('This is a toast message!');
	}
	showPositiveToast(){
		Toast.showPositive('This is a positive toast message!');
	}
	showNegativeToast(){
		Toast.showNegative('This is a negative toast message!');
	}
}

export default DialogsModule;