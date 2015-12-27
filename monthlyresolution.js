var Resolutions=new Mongo.Collection('resolution');
if (Meteor.isClient) {

	
Meteor.subscribe("resol");
Template.body.helpers({

// resolutions:[{title:"First Title"}] 
resolutions:function()
{
	if(Session.get('hide-Finished-Resolution'))
	{
 	return Resolutions.find({checked:{$ne:true}});
	}
	else
	{
		 return Resolutions.find();
	}
 
},
hideFinishedResolution:function()
{
	return Session.get('hide-Finished-Resolution');
}



});



Accounts.ui.config({

	passwordSignupFields: "USERNAME_ONLY"

});

Template.resolution.helpers({

	isOwner:function()
	{
		return this.owner=Meteor.userId();
	}

});

Template.body.events({

	'submit .new-resolution':function(event)
	{
		var title=event.target.title.value;
		Meteor.call("addResolution", title);
		//removed insecure
		// Resolutions.insert({
		// 	title:title,
		// 	CreatedAt:new Date()

		// });
event.target.title.value='';
return false;
	},
	'change .hide-finished':function(event)
	{
		Session.set('hide-Finished-Resolution', event.target.checked);
	}



});

Template.resolution.events({

'click .delete':function()
{
	Meteor.call("deleteRecord",this._id );
	// Resolutions.remove(this._id);
},

'click .toggle-checked':function()
{

	Meteor.call("strikeResolution",this._id,this.checked);

	// Resolutions.update(this._id,{$set:{checked:!this.checked}});
}

});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("resol",function(){
return Resolutions.find();

  });
}

Meteor.methods({

addResolution:function(title)
{

		Resolutions.insert({
			title:title,
			CreatedAt:new Date(),
			owner:Meteor.userId()

		});
},
deleteRecord:function(id)
{
	Resolutions.remove(id);
},
strikeResolution:function(id,checked)
{
	Resolutions.update(id,{$set:{checked:!checked}});
}
});