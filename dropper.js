(function($){
  'use strict';
  $.fn.Dropper = function(options){
    var abc = "";
    const settings = $.extend({},$.fn.Dropper.defaults,options);
    if(!this.length){
      console.warn("Dropper: The element not available now");
      return false;
    }
    this.each(function(){
      const realElement = $(this);
      const elementClass = realElement.attr("class");
      let oldDropperInput = realElement.parent().find(".dropper-input");
      if(oldDropperInput.length>0){
        oldDropperInput.remove();
      }
      let newElement = $(`<input type='text' class='${elementClass} dropper-input' ${settings.extras} placeholder='${settings.placeholder}'>  `);
      if($(document).find(".dropdown-container").length==0){
        $("body").append($(`<div class="dropdown-container"></div>`));
      }

      let selected = [];
      realElement.after(newElement);
      realElement.hide();
      const dropdownContainer = $(document).find(".dropdown-container");
      newElement.on("keyup focus",function(e){
        if(e.which != 38 && e.which != 40 && e.which != 13){
          let searchKey = $(this).val();
          let results = Array();

          if( searchKey != ""){
            for(let i in settings.data){
              for(let key in settings.data[i]) {
                if(( typeof settings.data[i][key] == "string" && settings.data[i][key] !='' ) && settings.data[i][key].toLowerCase().indexOf( (searchKey.toLowerCase()) )!=-1) {
                  results[i]=settings.data[i];
                  break;
                }
              }
            }
          }
          showDropdown($(this),results);
        } 
        $(this).on("keydown",function(e){
          if(e.which==13){
            ideal(this);
          }
        });
      });
          
      function showDropdown(target,data){
        $(target).unbind("keydown");
        const limit = 10;
          dropdownContainer.html(" ");
          if(target.val()!="" && settings.create){
            dropdownContainer.append(`
            <div class="drop-down-item active" data-id="${target.val()}">
              <div class="drop-down-title create" >${target.val()}</span></div>
            </div>`);
          }
          if(data.length>0)$(dropdownContainer).find(".drop-down-item").removeClass("active");
          let active = "active";
          for(let i in data){
            dropdownContainer.append(settings.template(i,data,active));
            active ="";
          }
          doEvents(target,dropdownContainer);
      }

      function doEvents(target,dropdownContainer){
        let targetHeight = target.height();
        let targetTop = target.offset().top;
        let targetLeft = target.offset().left;
        let targetWidth = target.width();
        $(target).on("keydown",function(e){
          let active = dropdownContainer.find(".drop-down-item.active");
          if(e.which == 40){
            if(active.next().length){
              active.next().addClass("active");
              // $(target).val(active.next().find(".drop-down-title").text());
              active.removeClass("active");
            }
          }else if(e.which == 38){
            if(active.prev().length){
              active.prev().addClass("active");
              // $(target).val(active.prev().find(".drop-down-title").text());
              active.removeClass("active");
            }
          }
        });
        dropdownContainer.css({"display":"block","top":targetHeight+targetTop+15,"left":targetLeft,"width":targetWidth+25});
        $(".dropdown-container").on("mousedown",".drop-down-item",function(e){
          $(".drop-down-item").removeClass("active");
          $(e.currentTarget).addClass("active");
          // ideal(newElement);
        });
      }
      
      function ideal(target){
        let active = dropdownContainer.find(".drop-down-item.active");;
        if(active.length>0){
          let abc = active.find(".drop-down-title").text();
          newElement.val(abc);
          if(realElement.is("select")){
            realElement.html("<option selected value='"+active.attr("data-id")+"'></option>");
            settings.value=active.attr("data-id");
          }else {
            realElement.val(active.attr("data-id"));
          }
          let val = realElement.val().trim();
          selected = val;
          if(val!="" && !(val > 0) ){
            newElement.tooltip({title:"This name seems to new, this will create when you print/save",trigger:"manual"});
            newElement.tooltip("show");
          }else{
            newElement.tooltip("hide");
          }
        }else{
          let val = $(target).val().trim();
          realElement.val(val);
          selected = val;
        }
        dropdownContainer.hide();

        newElement.unbind("keydown");
        $(".dropdown-container").unbind("mousedown");
      }
      newElement.blur(function(e){
        ideal(this);
      });
      newElement.blur(function(e){
        settings.onBlur(e,selected);
      });
    })
    return this;
  }
  $.fn.Dropper.defaults = {
    placeholder:"choose one...",
    data:{},
    primaryKey:"id",
    create:true,
    keyHeader:"name",
    ajax:false,
    ajaxUrl:"",
    ajaxMethod:"POST",
    ajaxData:{},
    extras:"",
    value:"",
    onBlur:function(e,selected){
    },
    template:function(i,data,active){
      return `<div class="drop-down-item ${active}" data-id="${data[i][this.primaryKey]}">
         <div class="drop-down-title">${data[i][this.keyHeader]}</div>
     </div>`
    },


  };
}(jQuery))